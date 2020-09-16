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
  document.querySelector('#open-email').style.display = 'none';

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


function open_email(id) {

  console.log('This element has been clicked!')
  // console.log(email)

  document.querySelector('#emails-view').style.display = 'none';
  document.querySelector('#compose-view').style.display = 'none';
  document.querySelector('#open-email').style.display = 'block';

  // Clear page 
  document.querySelector('#open-email').innerHTML = "";

  // Get email details
  fetch(`/emails/${id}`)
  .then(response => response.json())
  .then(email => {
    console.log(email);

    // Display email
    var content = document.querySelector('#open-email')
    var element = document.createElement('div')
    element.innerHTML = `<b>From: </b> ${email.sender}<br>
                        <b>To: </b> ${email.recipients}<br>
                        <b>Subject: </b> ${email.subject}<br>
                        <b>Timestamp: </b> ${email.timestamp}<br>
                        <button id="reply-button" type="button" class="btn btn-outline-primary">Reply</button>
                        <button id="archive-button" type="button" class="btn btn-outline-primary">Archive</button>
                        <hr>
                        ${email.body}`

    content.appendChild(element)

    // Mark email as read
    fetch(`/emails/${id}`, {
      method: 'PUT',
      body: JSON.stringify({
          read: true
      })
    })

  }); // .then

} // fuction open_email


function load_mailbox(mailbox) {

  // Show the mailbox and hide other views
  document.querySelector('#emails-view').style.display = 'block';
  document.querySelector('#compose-view').style.display = 'none';
  document.querySelector('#open-email').style.display = 'none';

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

        // Set row background
        if (emails[i].read === false) {
          row.style.background = 'white';
        } else {
          row.style.background = '#ebebeb';
        }

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

        // Add event listener
        const email_id = emails[i].id
        row.addEventListener('click', () => open_email(email_id));

        // Append row into #email-view element
        emailsContent.appendChild(row);

      } // for loop
      
    }); // .then

} // func load_mailbox
