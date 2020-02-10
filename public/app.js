// Grab the articles as a json
$.getJSON("/articles", function (data) {
  // For each one
  for (var i = 0; i < data.length; i++) {

    $("#articles").append(`
      <div class='card' data-id=`+data[i]._id+`>
        <div class='card-body'>
          <h4 class='card-title'>`+ data[i].title +`</h4>
          <a class='card-text' href=`+ data[i].link +`>Read More</a>
          <br/>
          <a href='#' data-id=` + data[i]._id + ` class='btn btn-primary'>Leave a comment</a>
        </div>
      </div>`);
  }
});


// Whenever someone clicks a p tag
$(document).on("click", "a", function () {
  $(".modal").modal("show");
  // Empty the notes from the note section
  $(".modal-body").empty();
  // Save the id from the p tag
  var thisId = $(this).attr("data-id");

  // Now make an ajax call for the Article
  $.ajax({
    method: "GET",
    url: "/articles/" + thisId
  })
    // With that done, add the note information to the page
    .then(function (data) {
      console.log(data);
      // The title of the article
      $(".modal-body").append("<h6><strong>" + data.title + "</strong></h6>");
      // An input to enter a new title
      $(".modal-body").append("<label for='subjectinput'>Note Subject</label>");
      $(".modal-body").append("<input id='subjectinput' name='title' >");
      // A textarea to add a new note body
      $(".modal-body").append("<label for='bodyinput'>Note Body</label>");
      $(".modal-body").append("<textarea id='bodyinput' name='body'></textarea>");
      // A button to submit a new note, with the id of the article saved to it
      $("#savenote").attr("data-id",data._id)

      // If there's a note in the article
      if (data.note) {
        // Place the title of the note in the title input
        $("#subjectinput").val(data.note.title);
        // Place the body of the note in the body textarea
        $("#bodyinput").val(data.note.body);
      }
    });
});

// When you click the savenote button
$(document).on("click", "#savenote", function () {
  // Grab the id associated with the article from the submit button
  var thisId = $(this).attr("data-id");

  // Run a POST request to change the note, using what's entered in the inputs
  $.ajax({
    method: "POST",
    url: "/articles/" + thisId,
    data: {
      // Value taken from title input
      title: $("#titleinput").val(),
      // Value taken from note textarea
      body: $("#bodyinput").val()
    }
  })
    // With that done
    .then(function (data) {
      // Log the response
      console.log(data);
      // Empty the notes section
      $("#notes").empty();
    });

  // Also, remove the values entered in the input and textarea for note entry
  $("#titleinput").val("");
  $("#bodyinput").val("");
});