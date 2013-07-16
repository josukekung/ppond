$(function () {

  var username = sessionStorage.getItem('pondAppUsername');
  var userType = sessionStorage.getItem('pondAppUserType');
  var generateTable = function (data, bookingLink) {
    var table = $('#resultTable');
    var html = [];
    var data = $.isArray(data) ? data : [data];

    $.each(data, function (index, value) {
      var result = '<tr>';
      var booking = bookingLink ?
        '<a href="#">' + value.bookingId + '</a>' :
        value.bookingId;

      result += '<td>' + booking + '</td>';
      result += '<td>' + value.productDetail + '</td>';
      result += '<td>' + value.targetDate + '</td>';
      result += '<td>' + value.status + '</td>';
      result += '</tr>';

      html.push(result);
    });

    table.append(html.join('\n'));
  };

  // If already logged in
  if (username) {
    $('ul#navPanel').prepend('<li><a>' + username + '</a></li><li><a href="#" id="logout">Log out</a>');
    $('#targetDate').datepicker({ format: 'dd-mm-yyyy' });

    // Determine form state from userType
    if (userType === 'customer') {
      // Log in as customer

      $(document).on('submit', 'form', function (e) {
        e.preventDefault();

        $.post('endpoint/CreateBooking.php', $(this).serialize(), 'json')
          .done(function (data) {
            // TODO: Not to parse, return JSON by default
            data = JSON.parse(data);

            $.get('endpoint/GetListBookingInfoByCustomerId.json', {
              customerId: data.customerId
            })
              .done(function (data) { generateTable(data, false) });
          });
      });
    }
    else {
      // Log in as driver

      $('form input[type="text"]').each(function () {
        $(this).prop('disabled', true);
      });

      $.get('endpoint/GetAllBookingDef.json')
        .done(generateTable);
    }
  }

  $(document)
    .on('click', 'a#logout', function (e) {
      sessionStorage.removeItem('pondAppUsername');
      window.location = 'index.html';
    })
    .on('submit', 'form#loginPanel', function (e) {
      e.preventDefault();

      $.post('endpoint/login.php', $(this).serialize())
        .done(function (data) {
          // TODO: Not to parse, return JSON by default
          data = JSON.parse(data);

          sessionStorage.setItem('pondAppUsername', data.username);
          sessionStorage.setItem('pondAppUserType', data.userType);

          window.location = 'form.html';
        })
        .error(function () {
          // TODO: Handle errors
        });
    })
    .on('click', '#resultTable td a', function (e) {
      e.preventDefault();

      var bookingId = $(this).text();

      $.get('endpoint/GetBookingDefinitionByBookingId.json', {
        bookingId: bookingId
      })
        .done(function (data) {
          $.each(data, function (key, value) {
            var el = $('#' + key);
            if (el.length) {
              el.val(value);
            }
          });
        });
    });

});
