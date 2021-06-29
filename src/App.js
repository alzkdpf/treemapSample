import './App.css';
import TreemapView from './TreemapView';
import chart from './sample1.json';

function App() {
  return (
    <div className="App">
      <TreemapView width={1500} height={1500} data={chart} />
    </div>
  );
}

export default App;
