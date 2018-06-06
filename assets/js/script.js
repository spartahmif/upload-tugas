var students = []
var currentSection = 1
var post_url = "https://script.google.com/macros/s/AKfycbzwxJq8AXdJgfpdO_6aTzK1XxYfOUIPy_My7OtIX0sbxBfB-5wv/exec?action=POST_ASSIGNMENT"
var get_url = "https://script.googleusercontent.com/macros/echo?user_content_key=C8Q9dXAS_hqXmLJLXQflsJIeHCLieADahTk9kl_2chabsWUMR69DNaAQbAVu1piuP5oLFMGPwezVQdQF1hNujlFEItyh3ut6m5_BxDlH2jW0nuo2oDemN9CCS2h10ox_1xSncGQajx_ryfhECjZEnNHPGc3xkfaz1LdidAuwJP8rLNS6y1_hoq2womiO0BfGJ4gPoS1TKp1QCYuNzWwGRvs0Sp-6Qke277iHlTyRM7Fe3pf2s161KlFwDYnpat1RuY0Vh9Dso1g&lib=MoDMSa-u8He-AWCSgL7s-BX9CcG857dnx"
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

  getRegistered(showRegistered)
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

getRegistered = (cb) => {
  let list = $("#list")
  list.html("Loading ...")

  $.get({
    url: get_url,
    success: (data) => {
      cb(JSON.parse(data))
    },
    error: (err) => {
      list.html("Error: " + err)
    }
  })
}

showRegistered = (rows) => {
  let list = $("#list")
  list.empty()
  rows.forEach((item, index) => {
    let litem = $("<div></div>", {class: "list-item"})
    let date = new Date(item[0])
    litem.html(
      "["
      + item[1]
      + "] "
      + item[2]
      + " ("
      + date.toLocaleDateString("id-ID")
      + " "
      + date.toLocaleTimeString("id-ID")
      + ")")
    list.append(litem)
  })
}
