//linked to main.handlebars ans used by user-routes for 
//front end call
async function logout(){
   const response = await fetch('/api/users/logout', {
       method: 'post',
       headers: { 'Content-Type': 'application/json'}
    });
    if (response.ok){
        document.location.replaced('/');
    }else{
        alert(response.statusText);
    }
}
document.querySelector('#logout').addEventListener('click', logout);
