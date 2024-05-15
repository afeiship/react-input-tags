import ReactInputTags from '@jswork/react-input-tags/src';
import './index.css';
import '@jswork/react-input-tags/src/style.scss';

function App() {
  return (
    <div className="m-10 p-4 shadow bg-gray-100 text-gray-800 hover:shadow-md transition-all">
      <div className="badge badge-warning absolute right-0 top-0 m-4">
        Build Time: {BUILD_TIME}
      </div>
      <h1>react-input-tags</h1>
      <ReactInputTags />
      <button className="btn btn-info">Button</button>
    </div>
  );
}

export default App;
