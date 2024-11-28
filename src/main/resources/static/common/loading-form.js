/**
 작성자:    김수정
 작성일:    2024-10-10
 내용:
 **********************************************
 변경일자        변경자         요청자
 **********************************************
 **/
export class loadingForm extends HTMLElement {
    constructor() {
        super();
        this.isLoading = false;
    }
    async connectedCallback() {
        if(!this.isLoading) {
            this.render();
        }
    }
    render() {
        this.innerHTML = `<button class="btn-primary" type="button" disabled>
                                  <span class="spinner-border" aria-hidden="true" style="margin-right: 0.2rem"></span>
                                  <span role="status" style="font-size: x-large">Loading...</span>
                                </button>`;
    }
    invisible() {
        this.classList.add('invisible');
        this.isLoading = false;
    }
    visible() {
        this.classList.remove('invisible');
        this.isLoading = true;
    }

}
customElements.define("loading-form", loadingForm);