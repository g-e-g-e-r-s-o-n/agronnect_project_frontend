import Login from "./Login.vue"
import { mount } from "@vue/test-utils"

describe("Login", () => {
    it("renders properly", () => {
        const wrapper = mount(Login, { props: { msg: "Email Password Log In  Don't have an account?" } })

        expect(wrapper.text()).toContain("Email Password Log In  Don't have an account?")
    })
})