
const loginSignupBtn = document.querySelector('.login-signup-btn')
const registerSignupBtn = document.querySelector('.register-login-btn')

const loginForm =document.querySelector('.login-form-container')
const registerForm = document.querySelector('.register-form-container')

const loginErrorMessageDiv = document.querySelector('.login-error-message');
const registerErrorMessageDiv = document.querySelector('.register-error-message');

loginSignupBtn.addEventListener('click',changeType)
registerSignupBtn.addEventListener('click',changeType)

document.getElementById('login-user').addEventListener('submit', async (e) => {
    e.preventDefault();  // Prevent default form submission
    
    const email = document.getElementById('email-login').value;
    const password = document.getElementById('password-login').value;

    try {
        const response = await fetch('/api/v1/auth/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({email, password }),
        });

        if (!response.ok) {
            const errorData = await response.json(); // Attempt to parse the error response as JSON
            loginErrorMessageDiv.textContent = errorData.msg || 'Login failed. Please try again.';
            return; // Exit if there was an error
        }
        
        window.location.href = '/pages/index.html'
        const data = await response.json(); // Parse the successful response
        
    } catch (error) {
        errorMessageDiv.innerText = 'An unexpected error occurred. Please try again.';
        console.error('Fetch error:', error); // Log any network or unexpected errors
    }
});


document.getElementById('register-user').addEventListener('submit', async (e) => {
    e.preventDefault();  // Prevent default form submission

    const name = document.getElementById('name-register').value;
    const email = document.getElementById('email-register').value;
    const password = document.getElementById('password-register').value;
    

    try {
        const response = await fetch('/api/v1/auth/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ name, email, password }),
        }); 
        console.log('Fetch response:', response);

        if (!response.ok) {
            const errorData = await response.json(); // Attempt to parse the error response as JSON
            registerErrorMessageDiv.innerText = errorData.msg || 'Login failed. Please try again.';
            return; // Exit if there was an error
        }
        
        window.location.href = '/pages/login.html'
        const data = await response.json(); // Parse the successful response
        
    } catch (error) {
        registerErrorMessageDiv.innerText = 'An unexpected error occurred. Please try again.';
        console.error('Fetch error:', error); // Log any network or unexpected errors
    }y
});

function changeType(){
    if(loginForm.classList.contains('hidden')){
        loginForm.classList.remove('hidden')
        registerForm.classList.add('hidden')
    }
    else if(registerForm.classList.contains('hidden')){
        registerForm.classList.remove('hidden')
        loginForm.classList.add('hidden')
    }
    loginErrorMessageDiv.textContent =''
    registerErrorMessageDiv.textContent =''
   

}


