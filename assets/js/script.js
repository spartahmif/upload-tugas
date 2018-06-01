var students = []
var currentSection = 1
var post_url = "https://script.google.com/macros/s/AKfycbzwxJq8AXdJgfpdO_6aTzK1XxYfOUIPy_My7OtIX0sbxBfB-5wv/exec?action=POST_ASSIGNMENT"
var errors = { }

$(document).ready(() => {
  $("#uploadhelp").hide()
  $("#fileraw").on("change", (e) => {
    $("#uploadhelp").show()
    var file = e.target.files[0]
    var fr = new FileReader()

    $("#filename").val(file.name)
    fr.onload = (e) => {
      $("#file").val(e.target.result.replace(/^.*,/, ""))
      $("#uploadhelp").hide()
    }
    fr.readAsDataURL(file)
  })
})

validateInputTextField = (id) => {
  let selector = "input[name=" + id + "]";
  let text = $(selector).val();
  let validate = $(selector).attr("validate");
  if (validateText(text, validate)) {
    removeError(id)
  } else {
    const errorId = parseInt($(selector).attr("sectid"))
    addError(id, errorId)
  }
}

validateText = (text, validate) => {
  return new RegExp(validate).test(text);
}

addError = (id, sectId) => {
  errors[id] = sectId
  $("small.help[for=" + id + "]").addClass("error")
}
removeError = (id) => {
  delete errors[id]
  $("small.help[for=" + id + "]").removeClass("error")
}

goToSection = (id) => {
  if (id > currentSection) nextSection(id)
  else if (id < currentSection) prevSection(id)
}

nextSection = (id) => {
  let curr = $("#sect" + currentSection)
  let next = $("#sect" + id)
  next.css("left", "100vw")
  curr.animate({ left: "-100vw", opacity: 0}, 500, "swing", () => {
    curr.addClass("hidden")
    next.removeClass("hidden")
    next.animate({ left: "0", opacity: 1}, 500, "swing")
    currentSection = id
  })
}

prevSection = (id) => {
  let curr = $("#sect" + currentSection)
  let next = $("#sect" + id)
  next.css("left", "-100vw")
  curr.animate({ left: "100vw", opacity: 0}, 500, "swing", () => {
    curr.addClass("hidden")
    next.removeClass("hidden")
    next.animate({ left: "0", opacity: 1}, 500, "swing")
    currentSection = id
  })
}

validateForm = () => {
  validateInputTextField("nim");

  return $.isEmptyObject(errors);
}

submitFile = () => {
  if (validateForm()) {
    let post_data = { }
    post_data["nim"] = $("#nim").val()
    post_data["name"] = $("#name").val()
    post_data["filename"] = $("#filename").val()
    post_data["file"] = $("#file").val()
    $("#submitButton").html("Submitting...")

    $.post({
      url: post_url,
      data: post_data,
      success: () => {
        goToSection(2)
      },
      fail: (xhr, textStatus, errorThrown) => {
        $("#errorMsg").html(xhr.responseText)
        goToSection(3)
      }
    })
  }
}
