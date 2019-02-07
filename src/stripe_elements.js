import { Controller } from "stimulus"

export default class extends Controller {
  static targets = [ "form", "card", "errors" ]

  connect() {
    this.stripe    = Stripe(this.data.get("public-key"))
    const elements = this.stripe.elements()
    const style = {
      base: {
        fontFamiliy: "'system-ui', 'BlinkMacSystemFont', '-apple-system', 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', 'sans-serif'",
        fontSize: "16px",
        color: "#3d4852",
        // etc.
      }
    }

    this.card = elements.create("card", { style: style })
    this.card.mount(this.cardTarget)
  }

  change(event) {
    if (event.error) {
      this.errorsTarget.textContent = event.error.message
    } else {
      this.errorsTarget.textContent = ""
    }
  }

  stripeTokenHandler(token) {
    const hiddenInput = document.createElement("input")

    hiddenInput.setAttribute("type", "hidden")
    hiddenInput.setAttribute("name", "stripeToken")
    hiddenInput.setAttribute("value", token.id)
    this.formTarget.appendChild(hiddenInput)

    this.formTarget.submit()
  }

  submit(event) {
    event.preventDefault()

    this.stripe.createToken(this.card).then((result) => {
      if (result.error) {
        this.errorsTarget.textContent = error.message
      } else {
        this.stripeTokenHandler(result.token)
      }
    })
  }
}
