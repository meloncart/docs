import DefaultTheme from 'vitepress/theme-without-fonts';
import VPButton from 'vitepress/dist/client/theme-default/components/VPButton.vue';
import './custom.css';

export default {
    extends: DefaultTheme,
    enhanceApp({ app }) {
        app.component('VPButton', VPButton);
    }
};
