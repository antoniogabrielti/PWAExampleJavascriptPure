;(function(){
'use strict';
var btGithub = document.querySelector('#bt-github');

btGithub.addEventListener('click',(event)=>{
  self.fetch('https://api.github.com/users')
    .then((response)=>{
      return response.json();
    }).then((users)=>{
      console.log('Github Usuarios: ',users);
    });
});
})();