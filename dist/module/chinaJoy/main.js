require.config({
    paths: {
        jquery: '../../scripts/jquery-3.1.0.min',
        vue: 'vue.min',
        commons:'commons',
        school:'school',
        action:'action',
    }
});
 
require(['school','action']);
