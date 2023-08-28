const { createApp } = Vue;

createApp({
    data() {
        return {
            cityData: {},
            city: '',
            apiKey: '6ecd0a5ea79642363ecefa32808e603f',
            error: false,
        }
    },
    created() {

    },
    methods: {
        getCityInfo(city){
            axios.get(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${this.apiKey}&units=metric`)
            .then(response => {
                this.cityData = response.data;
                this.error = false; 
                console.log(this.cityData.clouds.all)
            })
            .catch(error =>  {
                if (error.response && error.response.status === 404) {
                  this.error = true; 
                }});
        }
    }
}).mount('#app');