// Init F7 Vue Plugin
Framework7.use(Framework7Vue);
var $$ = Dom7;

// Init Page Components
Vue.component('page-home', {
  template: '#page-home',
  data() {
    const self = this;
    const filters = self.$root.filters;
    return { filters };
  }
});

Vue.component('page-rep', {
  template: '#page-rep',
  props: {
    __pk_contact: String
  },
  data() {
    const self = this;
    const congress = self.$root.congress;
    const thisRep = congress.reps.filter(function(rep) { return rep.__pk_contact === self.__pk_contact; })[0];
    return {
      rep: thisRep
    };
  }
});

Vue.component('page-inc', {
  template: '#page-inc',
  props: {
    __pk_location: String
  },
  data() {
    const self = this;
    const shootings = self.$root.shootings;
    const thisInc = shootings.incidents.filter(function(inc) { return inc.__pk_location === self.__pk_location; })[0];
    return {
      inc: thisInc
    };
  }
});

Vue.component('page-by-year', {
  template: '#page-by-year',
  props: {
    year: String
  },
  data() {
    const self = this;
    const shootings = self.$root.shootings;
    const thisList = shootings.incidents.filter(function(inc) { return inc.year === self.year; });
    return {
      incidents: thisList
    };
  }
});

Vue.component('page-by-state', {
  template: '#page-by-state',
  props: {
    state: String
  },
  data() {
    const self = this;
    const shootings = self.$root.shootings;
    const thisList = shootings.incidents.filter(function(inc) { return inc.state === self.state; });
    return {
      incidents: thisList
    };
  }
});

Vue.component('page-by-venue', {
  template: '#page-by-venue',
  props: {
    venue: String
  },
  data() {
    const self = this;
    const shootings = self.$root.shootings;
    const thisList = shootings.incidents.filter(function(inc) { return inc.venue === self.venue; });
    return {
      incidents: thisList
    };
  }
});

Vue.component('page-about', {
  template: '#page-about',
  data() {
	const self = this;
    const reference = self.$root.reference;
    return { reference };
  }
});

Vue.component('page-not-found', {
  template: '#page-not-found'
});

// Init App
new Vue({
  el: '#app',
  data: function () {
    return {
      // Framework7 parameters here
      f7params: {
        root: '#app', // App root element
        view: {
          pushState: true,
        },
        id: 'com.gunskillpeople', // App bundle ID
        name: 'Guns Kill People', // App name
        theme: 'ios', // Automatic theme detection
        version: '0.0.1', // App version
        // App routes
        routes: [
          {
            path: '/',
            component: 'page-home',
          },
          {
            path: '/byYear/:year/',
            component: 'page-by-year'
          },
          {
            path: '/byState/:state/',
            component: 'page-by-state'
          },
          {
            path: '/byVenue/:venue/',
            component: 'page-by-venue'
          },
          {
            path: '/rep/:__pk_contact/',
            component: 'page-rep'
          },
          {
            path: '/inc/:__pk_location/',
            component: 'page-inc'
          },
          {
            path: '/devnotes/',
            content: `
              <div class="page">
                <div class="navbar">
                  <div class="navbar-inner sliding">
                    <div class="left">
                      <a href="#" class="link back">
                        <i class="icon icon-back"></i>
                        <span class="ios-only">Back</span>
                      </a>
                    </div>
                    <div class="title">Dev Notes</div>
                  </div>
                </div>
                <div class="page-content">
                  <div class="card">
                    <div class="card-header">xxxxx</div>
                    <div class="card-content card-content-padding">xxxxx</div>
                  </div>
                </div>
              </div> 
           `
          },
          {
            path: '/about/',
            component: 'page-about'
          },
          {
            path: '(.*)',
            component: 'page-not-found',
          },
        ],
      },
      shootings: {
        incidents: []
      },
      congress: {
        reps: []
      },
      reference: {
	      ref:[]
      },
      filters: {
        shootingYears: [],
        shootingVenues: [],
        shootingStates: [],
      },
      isBottom: false,
    };
  },
  methods: {
    reloadShootings(event, done) {
      const self = this;
      const app = self.$f7;
      app.request.json(shootingsURL, function (data) {
        self.shootings = data;
        done();
      });    
    },
    reloadCongress(event, done) {
      const self = this;
      const app = self.$f7;
      app.request.json(congressURL, function (data) {
        self.congress = data;
        done();
      });    
    },
    fetchEventsList: function() {
      const self = this;
      const app = self.$f7;
      app.request.json(congressURL, function (data) {
        self.congress = data;
      });
      app.request.json(shootingsURL, function (data) {
        self.shootings = data;
      });
    }
  },
  mounted: function() {
    const self = this;
    const app = self.$f7;
    app.request.json(congressURL, function (data) {
      self.congress = data;
    });
    app.request.json(refURL, function (data) {
      self.reference = data;
    });
    app.request.json(shootingsURL, function (data) {
      self.shootings = data;
      var flags = [];
      self.filters.shootingYears = [];
      var l = self.shootings.incidents.length;
      for(var i=0; i<l; i++) {
          if( flags[self.shootings.incidents[i].year]) continue;
          flags[self.shootings.incidents[i].year] = true;
          self.filters.shootingYears.push(self.shootings.incidents[i].year);
      }
      self.filters.shootingYears.sort().reverse();
      flags = [];
      self.filters.shootingVenues = [];
      for(i=0; i<l; i++) {
          if( flags[self.shootings.incidents[i].venue]) continue;
          flags[self.shootings.incidents[i].venue] = true;
          self.filters.shootingVenues.push(self.shootings.incidents[i].venue);
      }
      self.filters.shootingVenues.sort();
      flags = [];
      self.filters.shootingStates = [];
      for(i=0; i<l; i++) {
          if( flags[self.shootings.incidents[i].state]) continue;
          flags[self.shootings.incidents[i].state] = true;
          self.filters.shootingStates.push(self.shootings.incidents[i].state);
      }
      self.filters.shootingStates.sort();
    });
  },
  beforeDestroy() {
  },
  created: function() {
    $$('body').css('backgroundColor', '#ffffff');
    $$('#app').show();
  }
});

addToHomescreen({
  modal: true,
  maxDisplayCount: 0,
  startDelay: 2, // wait 2 seconds to display
  message: 'To add Guns Kill People to your home screen: tap %icon and then <strong>Add to Home Screen</strong>',
  displayPace: 5, // display every 5 minutes
  lifespan: 15
});

