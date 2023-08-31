const { createApp } = Vue;

createApp({
    data() {
        return {
            cityData: {},
            cityInfo: {},
            city: '',
            apiKey: '6ecd0a5ea79642363ecefa32808e603f',
            error: false,
            fotoReference:'',
            cityInfoFoto: '',
        }
    },
    created() {

    },
    methods: {
        getCityFoto(){  
            const proxyUrl = '../server/proxy.php';
            const apiUrl = `https://maps.googleapis.com/maps/api/place/photo?photoreference=${this.fotoReference}&key=AIzaSyB4eoKYOXAJkCAA0MpxJqGSV2hiPJzjRKc&maxwidth=1200&maxheight=800`;
            const fullUrl = `${proxyUrl}?url=${encodeURIComponent(apiUrl)}`;
        
            axios.get(fullUrl, { responseType: 'arraybuffer' })  
                .then(response => {
                    const imageBlob = new Blob([response.data], { type: 'image/jpeg' });
                    this.cityInfoFoto = URL.createObjectURL(imageBlob); 
                    console.log(this.cityInfoFoto);
                })
                .catch(error => {
                    console.log(error);
                });
        },

        getCityInfo(city){
            axios.get(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${this.apiKey}&units=metric`)
            .then(response => {
                this.cityData = response.data;
                this.error = false; 
            })
            .catch(error =>  {
                if (error.response && error.response.status === 404) {
                  this.error = true; 
            }});
        },

        getCityData(city) {
            const proxyUrl = '../server/proxy.php';
            const apiUrl = `https://maps.googleapis.com/maps/api/place/findplacefromtext/json?input=${city},%20IL&key=AIzaSyB4eoKYOXAJkCAA0MpxJqGSV2hiPJzjRKc&inputtype=textquery&fields=name,photos`;
            const fullUrl = `${proxyUrl}?url=${encodeURIComponent(apiUrl)}`;
        
            axios.get(fullUrl)
                .then(response => {
                    this.cityInfo = response.data;
                    this.fotoReference =this.cityInfo.candidates[0].photos[0].photo_reference;
                    this.getCityFoto();
                    console.log(this.fotoReference);
                })
                .catch(error => {
                    console.log(error);
                });
        },

        
    }
}).mount('#app');