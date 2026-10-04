(function(){
  "use strict";

  function val(id){ return document.getElementById(id).value.trim(); }

  function buildMessage(){
    var name = val('name') || '(name not entered)';
    var status = document.querySelector('input[name="status"]:checked').value;
    var guests = val('guests');
    var game = val('game');
    var note = val('note');

    var lines = [
      'Tee\'s Final Shirting RSVP',
      'From: ' + name,
      'Status: ' + status
    ];
    if (guests && guests !== '0') lines.push('Bringing ' + guests + ' extra ' + (guests === '1' ? 'guest' : 'guests'));
    if (game) lines.push('Recommending: ' + game);
    if (note) lines.push('Note: ' + note);
    return lines.join('\n');
  }

  function copyText(text, btn){
    function done(ok){
      if(!btn) return;
      btn.textContent = ok ? 'Copied' : 'Select it manually';
      btn.classList.add('copied');
      setTimeout(function(){
        btn.textContent = btn.dataset.originalLabel || 'Copy';
        btn.classList.remove('copied');
      }, 1800);
    }
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(text).then(function(){ done(true); }, function(){ done(false); });
    } else {
      done(false);
    }
  }

  var form = document.getElementById('rsvpForm');
  var result = document.getElementById('result');
  var resultText = document.getElementById('resultText');
  var copyBtn = document.getElementById('copyBtn');
  var smsBtn = document.getElementById('smsBtn');
  var mailBtn = document.getElementById('mailBtn');

  form.addEventListener('submit', function(e){
    e.preventDefault();
    var message = buildMessage();
    resultText.textContent = message;
    result.hidden = false;

    var phone = document.getElementById('hostPhone').textContent.trim();
    var email = document.getElementById('hostEmail').textContent.trim();
    var encoded = encodeURIComponent(message);

    smsBtn.setAttribute('href', 'sms:' + encodeURIComponent(phone) + '?&body=' + encoded);
    mailBtn.setAttribute('href', 'mailto:' + encodeURIComponent(email) + '?subject=' + encodeURIComponent('Tee\'s Final Shirting RSVP') + '&body=' + encoded);

    result.scrollIntoView({behavior:'smooth', block:'nearest'});
  });

  copyBtn.dataset.originalLabel = 'Copy message';
  copyBtn.addEventListener('click', function(){
    copyText(resultText.textContent, copyBtn);
  });

  Array.prototype.forEach.call(document.querySelectorAll('.copybtn'), function(btn){
    btn.dataset.originalLabel = btn.textContent;
    btn.addEventListener('click', function(){
      var targetId = btn.getAttribute('data-copy-target');
      var text = document.getElementById(targetId).textContent.trim();
      copyText(text, btn);
    });
  });

    // Photo booth (tee1 / tee2): each photo fills its frame cropped
  // (object-fit: cover) by default. Tapping or pressing Enter/Space
  // toggles the .contain class from style.css so the whole photo
  // becomes visible — a lightweight "resize" the guest controls,
  // since a real photo's proportions won't always match the frame.
  Array.prototype.forEach.call(document.querySelectorAll('.tee-img'), function(img){
    img.setAttribute('role', 'button');
    img.setAttribute('aria-pressed', 'false');
    img.setAttribute('aria-label', 'Tap to see the full photo');

    function toggleFit(){
      var showingFull = img.classList.toggle('contain');
      img.setAttribute('aria-pressed', showingFull ? 'true' : 'false');
    }

    img.addEventListener('click', toggleFit);
    img.addEventListener('keydown', function(e){
      if (e.key === 'Enter' || e.key === ' ' || e.key === 'Spacebar') {
        e.preventDefault();
        toggleFit();
      }
    });
  });
})();
