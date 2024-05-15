import React, { HTMLAttributes, ReactNode } from 'react';
import noop from '@jswork/noop';
import cx from 'classnames';
import fde from 'fast-deep-equal';
import RcList, { ReactListProps, TemplateArgs } from '@jswork/react-list';

const CLASS_NAME = 'react-input-tags';
const TRIGGER_KEYS = ['Tab', 'Enter', 'Space'];

// @ https://cdpn.io/iamqamarali/fullpage/qyawoR?anon=true&view=
type StdEventTarget = { target: { value: any } };
type StdCallback = (inEvent: StdEventTarget) => void;
export type TemplateTagArgs = TemplateArgs & {
  item: string;
  disabled?: boolean;
}

type Props = {
  /**
   * The CSS class name of the root element.
   * @default ''
   */
  className?: string;
  /**
   * The initial items of the input.
   * @default []
   */
  items?: string[];
  /**
   *  Whether the input is disabled.
   *  @default false
   */
  disabled?: boolean;
  /**
   * The callback function when the input value changes.
   * @default noop
   */
  onChange?: StdCallback;
  /**
   * The template function for rendering each tag.
   * @default (args, cb) => <span className="tag">{args.item}</span>
   */
  templateTag: (args: TemplateTagArgs, cb: () => void) => ReactNode;
  /**
   * The props of the list component.
   * @default {}
   */
  listPros?: ReactListProps
} & HTMLAttributes<HTMLDivElement>;

type State = {
  items?: string[];
  inputValue: string;
  isComposite: boolean;
};

export default class AcInputTags extends React.Component<Props, State> {
  static displayName = CLASS_NAME;
  static formSchema = CLASS_NAME;
  static defaultProps = {
    items: [],
    disabled: false,
    onChange: noop,
  };

  inputRef = React.createRef<HTMLInputElement>();

  constructor(inProps) {
    super(inProps);
    const { items } = inProps;
    this.state = {
      items,
      isComposite: false,
      inputValue: '',
    };
  }

  shouldComponentUpdate(nextProps: Readonly<Props>): boolean {
    const { items } = nextProps;
    if (!fde(items, this.props.items)) {
      this.setState({ items });
    }
    return true;
  }

  handleInputChange = (inEvent) => {
    const { value } = inEvent.target;
    this.setState({ inputValue: value });
  };

  handleInputKeyAction = (inEvent) => {
    const { code } = inEvent;
    const { value } = inEvent.target;
    const { items, isComposite } = this.state;
    const val = value.trim();
    const idx = items!.length - 1;
    inEvent.stopPropagation();

    if (isComposite) return false;
    if (code === 'Backspace') return this.handleTagRemove(idx);
    if (code === 'Tab') inEvent.preventDefault();
    if (TRIGGER_KEYS.includes(code)) {
      if (val) {
        if (!items!.includes(val)) {
          items!.push(val);
          this.setState({ inputValue: '' });
          this.execChange(items!);
        }
      }
    }
  };

  handleTagRemove = (inIndex, inForce?: boolean) => {
    const { disabled } = this.props;
    const { items, inputValue } = this.state;
    if (disabled) return;
    const newItems = items!.filter((_, idx) => idx !== inIndex);
    if (!inputValue || inForce) this.execChange(newItems);
  };

  handleMouseEnter = () => {
    this.inputRef.current?.focus();
  };

  execChange = (inItems) => {
    const { onChange } = this.props;
    this.setState({ items: (inItems || []).slice(0) }, () => {
      this.inputRef.current?.focus();
      onChange!({ target: { value: inItems } });
    });
  };

  renderTagTemplate = (args: TemplateArgs) => {
    const { templateTag, disabled } = this.props;
    const { item, index, items } = args;
    const cb = () => this.handleTagRemove(index);
    return templateTag({ item, index, items, disabled }, cb);
  };

  render() {
    const { className, onChange, disabled, templateTag, listPros, autoFocus, ...props } = this.props;
    const { items, inputValue } = this.state;

    return (
      <div
        data-disabled={disabled}
        className={cx(CLASS_NAME, className)}
        onMouseOver={this.handleMouseEnter}
        onClick={this.handleMouseEnter}
        {...props}>
        <RcList items={items!} template={this.renderTagTemplate} {...listPros} />
        <input
          disabled={disabled}
          autoFocus={autoFocus}
          ref={this.inputRef}
          onCompositionStart={() => this.setState({ isComposite: true })}
          onCompositionEnd={() => this.setState({ isComposite: false })}
          onInput={this.handleInputChange}
          onKeyDown={this.handleInputKeyAction}
          value={inputValue}
          className={`${CLASS_NAME}__input`}
        />
      </div>
    );
  }
}
