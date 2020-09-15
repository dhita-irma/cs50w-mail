document.addEventListener('DOMContentLoaded', function() {

  // Use buttons to toggle between views
  document.querySelector('#inbox').addEventListener('click', () => load_mailbox('inbox'));
  document.querySelector('#sent').addEventListener('click', () => load_mailbox('sent'));
  document.querySelector('#archived').addEventListener('click', () => load_mailbox('archive'));
  document.querySelector('#compose').addEventListener('click', compose_email);

  // By default, load the inbox
  load_mailbox('inbox');
});

function compose_email() {

  // Show compose view and hide other views
  document.querySelector('#emails-view').style.display = 'none';
  document.querySelector('#compose-view').style.display = 'block';

  // Clear out composition fields
  document.querySelector('#compose-recipients').value = '';
  document.querySelector('#compose-subject').value = '';
  document.querySelector('#compose-body').value = '';

  document.querySelector('#compose-button').onclick = function(){

    const recipients = document.querySelector('#compose-recipients').value;
    const subject = document.querySelector('#compose-subject').value;
    const body = document.querySelector('#compose-body').value;

    // Send email
    fetch('/emails', {
      method: 'POST',
      body: JSON.stringify({
        recipients: recipients,
        subject: subject,
        body: body
      })
    })
    .then(response => response.json())
    .then(result => {
      console.log(result);
    });

    //Load sent box
    load_mailbox('sent');

  }
}

function load_mailbox(mailbox) {
  
  // Show the mailbox and hide other views
  document.querySelector('#emails-view').style.display = 'block';
  document.querySelector('#compose-view').style.display = 'none';

  // Show the mailbox name
  document.querySelector('#emails-view').innerHTML = `<h3>${mailbox.charAt(0).toUpperCase() + mailbox.slice(1)}</h3>`;

  fetch(`/emails/${mailbox}`)
    .then(response => response.json())
    .then(emails => {
      // Print emails
      console.log(emails);

      // Display emails 
      var emailsContent = document.querySelector('#emails-view');

      for (var i = 0; i < emails.length; i++) {
        
        // Create div element for each email row
        var row = document.createElement('div');
        row.className = 'row';

        // Create columns for each row 
        const colRescipients = `<div class="col-3"><b>${emails[i].recipients}</b></div>`;
        const colSender = `<div class="col-3"><b>${emails[i].sender}</b></div>`;
        const colSubject = `<div class="col-6">${emails[i].subject}</div>`;
        const colTime = `<div class="col-3 text-muted">${emails[i].timestamp}</div>`;

        // Append columns into row 
        if (mailbox === 'inbox') {
          row.insertAdjacentHTML('beforeEnd', colSender);
        } else {
          row.insertAdjacentHTML('beforeEnd', colRescipients);
        }
        row.insertAdjacentHTML('beforeEnd', colSubject);
        row.insertAdjacentHTML('beforeEnd', colTime);

        // Append row into #email-view element
        emailsContent.appendChild(row);

      } // For loop
      
    }); // .then

} // func load_mailbox
