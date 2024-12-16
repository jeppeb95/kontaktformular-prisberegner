/* Script der indhenter meddelses fra serveren og returnere i alert popup */
document.getElementById('contactForm').addEventListener('submit', async function (event) {
event.preventDefault(); /* Forhindrer standard indsendelse og sideopdatering */

/* Indhentning af formularens data */
const formData = new FormData(this);

try {
    /* Den indtastede data sendes til serveren */
    const response = await fetch(this.action, {
        method: 'POST',
        body: formData
    });

    /* Tjek om svaret har fejl */
    if (!response.ok) {
        throw new Error('Serveren svarede med en fejl: ' + response.status);
    }

    /* JSON respons fra serveren */
    const result = await response.json();

    /* Fejl/succes meddelelse ud fra JSON og nustilling af formular */
    if (result.success) {
        alert(result.message); 
        this.reset(); 
        grecaptcha.reset();
    } else {
        alert('Fejl: ' + result.message); 
    }
} catch (error) {
    /* Fejlmeddelelse */
    alert('Der opstod en fejl: ' + error.message);
}
});




