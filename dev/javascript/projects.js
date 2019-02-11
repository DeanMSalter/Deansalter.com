let profile;

function onSignIn(googleUser) {
  profile = googleUser.getBasicProfile();
  console.log('ID: ' + profile.getId()); // Do not send to your backend! Use an ID token instead.
  console.log('Name: ' + profile.getName());
  console.log('Image URL: ' + profile.getImageUrl());
  console.log('Email: ' + profile.getEmail()); // This is null if the 'email' scope is not present.


  console.log(gapi.auth2.getAuthInstance().isSignedIn.get())
  signOutToggle(gapi.auth2.getAuthInstance().isSignedIn.get())
  userPicToggle(gapi.auth2.getAuthInstance().isSignedIn.get())
}
function signOut() {
  var auth2 = gapi.auth2.getAuthInstance();
  auth2.signOut().then(function () {
    console.log('User signed out.');
    console.log(gapi.auth2.getAuthInstance().isSignedIn.get())
    signOutToggle(gapi.auth2.getAuthInstance().isSignedIn.get())
    userPicToggle(gapi.auth2.getAuthInstance().isSignedIn.get())
  });
}
function signOutToggle(loggedIn){
  let link = document.getElementById('SignOutLink');
  if(loggedIn){
    console.log("toggling")
    link.textContent = "Sign Out"
    link.title = "Sign Out";
    link.href = "#";
    link.onclick = signOut;
    link.style.display = "inline";
  }else{
    link.style.display = "none";
  }
}
function userPicToggle(loggedIn){
  let picTag = document.getElementById('userPic');
  if(loggedIn){
    picTag.src = profile.getImageUrl();
  }else{
    picTag.src = "";
  }
}
