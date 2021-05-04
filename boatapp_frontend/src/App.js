const axios = require('axios');

const App = (props) => {

  const handlePostClick = () => {
      axios.post('/api/boats', {name: 'test boat'}).then( res => {console.log(res)});
  }

return (
  <button onClick={handlePostClick}>create boat</button>
);
}

export default App;
