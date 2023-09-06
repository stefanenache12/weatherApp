const { createApp } = Vue;

createApp({
    data() {
        return {
            cityData: {},
            cityInfo: {},
            cityInfoFourDays : {},
            city: '',
            apiKey: '6ecd0a5ea79642363ecefa32808e603f',
            error: false,
            fotoReference:'',
            cityInfoFoto: '',
            hideCityInfo: true,
            cityLon: '',
            cityLat: '',
            formattedDates: [],
            dayInfo: {},
            singleDay: [],
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
                this.city = '';
                this.cityLon = response.data.coord.lon;
                this.cityLat = response.data.coord.lat;

                this.getInfoFourDays()
            })
            .catch(error =>  {
                if (error.response && error.response.status === 404) {
                  this.error = true; 
            }});
        },

        getInfoFourDays() {
            axios
              .get(
                `https://api.openweathermap.org/data/2.5/forecast?lat=${this.cityLat}&lon=${this.cityLon}&appid=6ecd0a5ea79642363ecefa32808e603f&units=metric&cnt=25`
              )
              .then((response) => {
                this.cityInfoFourDays = response.data;

                // Create a map to store the data for each date at 3 PM
                const dateDataMap = {};

                for (const item of this.cityInfoFourDays.list) {
                    const dateTimeParts = item.dt_txt.split(' ');
                    const date = dateTimeParts[0];
                    const time = dateTimeParts[1];

                    // Check if the time is 3 PM
                    if (time === '15:00:00') {
                    // Store temperature and cloud information
                    dateDataMap[date] = {
                        temperature: item.main.temp,
                        clouds: item.clouds.all,
                    };
                    }

                    // Split the date into year, month, and day
                    const [year, month, day] = date.split('-');

                    // If the date is not already recorded, add it to the dayInfo object
                    if (!this.dayInfo[date]) {
                    this.dayInfo[date] = {
                        date: date,
                        year: year,
                        month: month,
                        day: day,
                    };
                    }
                }

                // Merge the data into the dayInfo object
                for (const date in this.dayInfo) {
                    if (dateDataMap[date]) {
                    this.dayInfo[date].temperature = dateDataMap[date].temperature;
                    this.dayInfo[date].clouds = dateDataMap[date].clouds;
                    }
                }
                })
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
                })
                .catch(error => {
                    console.log(error);
                });
        },

        toggleCityInfo() {
            this.hideCityInfo = !this.hideCityInfo;
        },
    }
}).mount('#app');