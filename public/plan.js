
import './src/cart/toggleCart.js'

const questions = document.querySelectorAll('.drop-down-item')
const options = document.querySelectorAll('.option')
const closeModalSummaryBtn = document.querySelector('.modal-close-icon')
const spans = document.querySelectorAll('span')
const createPlanBtn = document.querySelector('.plan-btn')


// Event listener for dropdown
questions.forEach(function(question) {
    const dropDownBtn = question.querySelector('.drop');
    
    dropDownBtn.addEventListener('click', function() {
        checkIfOpen(question);
        const cards = question.querySelector('.cards');
        cards.classList.toggle('show');
        dropDownBtn.classList.toggle('icon-flip');
    });
});




// Event listener for selection of the cards
questions.forEach(function(question){
    const cards = question.querySelectorAll('.card')
    cards.forEach(function(card){
        card.addEventListener('click', function(){
            cards.forEach(function(exclude){
                if(exclude !=card){
                    exclude.classList.remove('select')
                    summary(card)

    
                }
                
            })
            
            card.classList.toggle('select')
            CheckOption(card)
            summary(card)
            createOrderSummaryBtn()
            GetOrderSummaryAmounts()
        })
        
    })
})

// connects option to question/dropdown
options.forEach(function(option){
    option.addEventListener('click', function(){
        targetID = option.getAttribute('data-id')
        const targetDropdown = document.getElementById(targetID)
        DropDown(targetDropdown)
    })
    
})



//closes modal once close button is clicked 



// opens modal once create plan button is clicked












// Loop through all questions and hide their cards (except the clicked one)
function checkIfOpen(exclude){
    questions.forEach(function(q) {
        const otherCards = q.querySelector('.cards');
        if (q !== exclude) { // Only hide cards that are not the one clicked
            otherCards.classList.remove('show');
            q.querySelector('.drop').classList.remove('icon-flip');
        }
    });
}



// remove disabled btn class on the create plan btn once all options have been chosen
function createOrderSummaryBtn(){

    const allOptions = [...document.querySelectorAll('.option')]
    const selected = allOptions.every((option)=> option.classList.contains('faint-text'))

    if(selected){
        createPlanBtn.classList.remove('disabled');

    }
    else{
        createPlanBtn.classList.add('disabled');
    }
    
}





// grabs selected cards and adds them to order summary 
function summary(card) {
    const parent = card.parentElement; // Get the parent of the clicked card
    const id = parent.id; // Get the ID of the parent dropdown item
    const cards = parent.querySelectorAll('.card'); // Get all individual cards
    let select = false; // Change const to let for mutability

    // Loop through all cards in the parent
    cards.forEach((card) => { // Rename the parameter to avoid confusion
        if (card.classList.contains('select')) {
            select = true; // Set select to true if a card is selected
            
            if(select){
                spans.forEach((span) => {
                    if (span.dataset.value === id) {

                        span.classList.remove('line'); // Add class if selected
                        const value = card.querySelector('h4').textContent; // Get the text content of the selected card's h4
                        span.textContent = value; // Update the span text with the h4 value                   
                    }
                });

            }
          
          
        }
        // if there is no card in the parent element that contains the class of select
        else if(!select){
            spans.forEach((span) => {
                if (span.dataset.value === id) {
                    span.textContent = ''; // Clear the span text
                    span.classList.add('line'); // Remove class
                }
            });

        }
    });

}


// Icon flip when dropdown img is clicked
function DropDown(target) {
    checkIfOpen(target)
    // Toggle the current clicked card
    const cards = target.querySelector('.cards');
    cards.classList.toggle('show');
    drop.classList.toggle('icon-flip');
    
}








// adds faint-text class to option to show a card has been chosen
function CheckOption(card) {
    const dropDownItem = card.closest('.drop-down-item');
    const id = dropDownItem.getAttribute('id');
    const cards = card.parentElement.querySelectorAll('.card'); // Select all cards in the same parent

    let selected = false;

    // Check if any card in the group has the 'select' class
    cards.forEach(function(card) {
        if (card.classList.contains('select')) {
            selected = true;
        }
    });

    // Then, update the corresponding option based on the selection
    options.forEach(function(option) {
        if (option.getAttribute('data-id') === id) {
            if (selected) {
                option.classList.add('faint-text');
            } else {
                option.classList.remove('faint-text');
            }
        }
    });
}




closeModalSummaryBtn.addEventListener('click', closeModal)
createPlanBtn.addEventListener('click', openModal)

// Open modal once create plan button is clicked

function openModal(){
    const modal = document.querySelector('.summary-pop-up')
    const allOptions = [...document.querySelectorAll('.option')]
    const selected = allOptions.every((option)=> option.classList.contains('faint-text'))
    const modalOverlay = document.getElementById('modal-overlay');
    if(selected){
        modal.classList.add('open-modal')
        window.scrollTo({
            top:0,
            behavior:'smooth'
        })
        modalOverlay.style.display = 'block';
    }
    
}

function closeModal(){
    const modal = document.querySelector('.summary-pop-up');
    const modalOverlay = document.getElementById('modal-overlay');
    modal.classList.remove('open-modal');
    modalOverlay.style.display = 'none'
}



function calculateSummaryCost(amount, frequency){
    let frequencyValue = frequency
    let cost =0
    if(frequencyValue === 1){
        cost = 14;
    }
    else if(frequencyValue === 2){
        cost = 14 + 3.25
    }
    else if(frequencyValue === 4){
        cost = 14 + 8.50
    }
    return cost;
}


function GetOrderSummaryAmounts(){
    const costValue = document.querySelector('#cost')

    const allOptions = [...document.querySelectorAll('.option')]
    const selected = allOptions.every((option)=> option.classList.contains('faint-text'));

    if(selected){
        const cards = document.querySelectorAll('.card')
        let frequency =0
        let  amount = 0
        cards.forEach((card)=>{
            if(card.classList.contains('select')){
                const parent = card.parentElement;
                if(parent.id === 'amount'){

                    amount = card.dataset.value;
                    //amount  = Number(initialAmount.replace(/\D/g, ''));
                }
                if(parent.id === 'how-often'){

                    frequency = Number(card.dataset.value);
                }

            }
            
        })

        const totalCost = calculateSummaryCost(amount,frequency)
        costValue.textContent = totalCost;
        
    }
    
    
}

