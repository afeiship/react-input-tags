import ReactInputTags from '@jswork/react-input-tags/src';
import './index.css';
import '@jswork/react-input-tags/src/style.scss';

function App() {
  return (
    <div className="m-10 p-4 shadow text-gray-800 hover:shadow-md transition-all">
      <div className="badge badge-warning absolute right-0 top-0 m-4">
        Build Time: {BUILD_TIME}
      </div>
      <h1>react-input-tags</h1>
      <ReactInputTags
        className="gap-2 mb-2 border border-solid border-gray-200 rounded-lg p-2"
        templateTag={(args, cb) => {
          return <span key={args.index} className="btn btn-primary btn-sm">{args.item}
            <button className="close" onClick={cb}>X</button>
          </span>;
        }}
      />
      <button className="btn btn-info">Button</button>
    </div>
  );
}

export default App;
