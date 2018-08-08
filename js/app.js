// Init F7 Vue Plugin
Framework7.use(Framework7Vue);
var $$ = Dom7;

const loginURL = 'https://academygroup-dev.geekpak.com/app-server/index.php?func=login';
const studentDataURL = 'https://academygroup-dev.geekpak.com/app-server/index.php?func=student';
const calendarDataURL = 'https://academygroup-dev.geekpak.com/app-server/index.php?func=calendar';
const classesDataURL = 'https://academygroup-dev.geekpak.com/app-server/index.php?func=classes';
const feedbackDataURL = 'https://academygroup-dev.geekpak.com/app-server/index.php?func=feedback';
// const refreshAudio = new Audio('./refresh.mp3');

// Init Page Components
Vue.component('page-class', {
  template: '#page-class',
  props: {
    classID: String
  },
  data() {
    const self = this;
    const classes = self.$root.classes;
    const thisClass = classes.filter(function(cls) { return cls.classID === self.classID; })[0];
    return {
      // classID: classes[self.classID],
      course: thisClass
    };
  }
});


Vue.component('page-about', {
  template: '#page-about'
});
Vue.component('page-academy', {
  template: '#page-academy'
});
Vue.component('page-form', {
  template: '#page-form'
});
Vue.component('page-dynamic-routing', {
  template: '#page-dynamic-routing'
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
        id: 'com.academygroup.studentapp', // App bundle ID
        name: 'Academy Group', // App name
        theme: 'ios', // Automatic theme detection
        version: '0.0.1', // App version
        // App routes
        routes: [
          {
            path: '/',
            url: '/',
            tabs: [
              {
                path: '/overview/',
                id: 'tab1'
              },
              {
                path: '/classes/',
                id: 'tab1'
              },
              {
                path: '/messages/',
                id: 'tab1'
              },
              {
                path: '/settings/',
                id: 'tab1'
              }
            ]
          },
          {
            path: '/class/:classID/',
            component: 'page-class'
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
                    <div class="card-header">Overview Notes</div>
                    <div class="card-content card-content-padding">The "Overview" tab will display a summary of most recent and/or upcoming activity from other sections, potentially in a chronological format like the one currently shown. This will probably the last page to be implemented due to the need to finalize features and options on other areas first, as well as getting the data properly structured.</div>
                  </div>
                  <div class="card">
                    <div class="card-header">Experiences Notes</div>
                    <div class="card-content card-content-padding">The "Experiences" tab will present a list of experiences (with a badge representing the number of assignments associated to that experience) that can be individually selected, allowing the student to dive in further to see all assignments and other information for the selected experiences.  Pull-to-refresh will reload the data from the server, so feel free to use the "Remove All Experiences" function above for testing.</div>
                  </div>
                  <div class="card">
                    <div class="card-header">Messages Notes</div>
                    <div class="card-content card-content-padding">The "Messages" tab will display a list of messages that can be expanded to view more information.  Pull-to-refresh will reload the data from the server, so feel free to use the "Remove All Messages" function above for testing.</div>
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
            path: '/academy/',
            component: 'page-academy'
          },
          {
            path: '/form/',
            component: 'page-form'
          },
          {
            path: '/dynamic-route/blog/:blogId/post/:postId/',
            component: 'page-dynamic-routing'
          },
          {
            path: '(.*)',
            component: 'page-not-found',
          },
        ],
      },
      loginEmail: '',
      loginPassword: '',
      calendar: {
        done: [],
        today: [],
        now: [],
        next: [],
        nextAssignments: [],
        attendance: [],
        nextDay: ''
      },
      classes: [],
      feedback: {
        celebration: []
      },
      student: {},
      timer: ''
      // 'student' : 
      // {
      //   'first' : 'Suhry',
      //   'id' : 9,
      //   'last' : 'Acosta'
      // }
    };
  },
  methods: {
    // testingAddClass() {
    //   this.classes.push({
    //     'classID' : 'xxx',
    //     'className' : 'Test Class',
    //     'class_id_string' : 'TC1',
    //     'in_session' : '1',
    //     'subject_id' : ''
    //   });
    // },
    // testingRemoveClasses() {
    //   this.classes = [];
    // },
    // testingDeleteFeedback() {
    //   this.feedback = {};
    // },
    // testingSetUser(which) {
    //   const self = this;
    //   const app = self.$f7;
    //   self.student.token = which;
    //   // set the student
    //   app.request.json(studentDataURL + '&token=' + encodeURIComponent(self.student.token) + '=', function (data) {
    //     self.student = data;
    //     localStorage.setItem('student',JSON.stringify(data));
    //   });
    //   // set the calendar
    //   app.request.json(calendarDataURL + '&token=' + encodeURIComponent(self.student.token) + '=', function (data) {
    //     self.calendar = data;
    //   });
    //   // set the classes
    //   app.request.json(classesDataURL + '&token=' + encodeURIComponent(self.student.token) + '=', function (data) {
    //     self.classes = data;
    //   });
    //   // set the feedback
    //   app.request.json(feedbackDataURL + '&token=' + encodeURIComponent(self.student.token) + '=', function (data) {
    //     self.feedback = data;
    //   });    
    // },
    signOut() {
      const self = this;
      const app = self.$f7;
      app.dialog.confirm('Are you sure you want to sign out?', () => {
          self.student = {};
          localStorage.setItem('student',JSON.stringify(self.student));
          self.calendar = { 
            done: [],
            today: [],
            now: [],
            next: [],
            nextAssignments: [],
            attendance: [],
            nextDay: ''
          };
          self.classes = [];
          self.feedback = {
            celebration: []
          };
      }, () => {});
    },
    getAssignmentCount(classID) {
      const self = this;
      const thisClass = self.classes.filter(function(cls) { return cls.classID === classID; })[0];
      return ((thisClass !== undefined) && (thisClass.assignments !== undefined) && (thisClass.assignments.length != 0)) ? thisClass.assignments.length : '';
    },
    userLogin() {
      const self = this;
      const app = self.$f7;
      if (self.loginEmail == '') {
        app.loginScreen.close();
      } else {
        app.request.json(loginURL + '&username=' + encodeURIComponent(self.loginEmail) + '&password=' + encodeURIComponent(self.loginPassword), function (data) {
          self.student = data;
          app.dialog.alert(self.student.statusMessage, () => {
            if ((self.student.statusID == '1') || (self.student.statusID == '2')) {
              // store the student data
              localStorage.setItem('student',JSON.stringify(data));
              // set the calendar
              app.request.json(calendarDataURL + '&token=' + encodeURIComponent(self.student.token) + '=', function (data) {
                self.calendar = data;
              });
              // set the classes
              app.request.json(classesDataURL + '&token=' + encodeURIComponent(self.student.token) + '=', function (data) {
                self.classes = data;
              });
              // set the feedback
              app.request.json(feedbackDataURL + '&token=' + encodeURIComponent(self.student.token) + '=', function (data) {
                self.feedback = data;
              });            
              app.loginScreen.close();
            }
          });
        });    
      }
    },
    reloadCalendar(event, done) {
      // refreshAudio.play();
      const self = this;
      const app = self.$f7;
      // console.log(calendarDataURL + '&token=' + encodeURIComponent(self.student.token) + '=');
      app.request.json(calendarDataURL + '&token=' + encodeURIComponent(self.student.token) + '=', function (data) {
        self.calendar = data;
        done();
      });    
    },
    reloadClasses(event, done) {
      // refreshAudio.play();
      const self = this;
      const app = self.$f7;
      // console.log(classesDataURL + '&token=' + encodeURIComponent(self.student.token) + '=');
      app.request.json(classesDataURL + '&token=' + encodeURIComponent(self.student.token) + '=', function (data) {
        self.classes = data;
        done();
      });    
    },
    reloadFeedback(event, done) {
      // refreshAudio.play();
      const self = this;
      const app = self.$f7;
      // console.log(feedbackDataURL + '&token=' + encodeURIComponent(self.student.token) + '=');
      app.request.json(feedbackDataURL + '&token=' + encodeURIComponent(self.student.token) + '=', function (data) {
        self.feedback = data;
        done();
      });    
    },
    fetchEventsList: function() {
      const self = this;
      const app = self.$f7;
      // console.log('reloading');
      app.request.json(calendarDataURL + '&token=' + encodeURIComponent(self.student.token) + '=', function (data) {
        self.calendar = data;
      });
      app.request.json(classesDataURL + '&token=' + encodeURIComponent(self.student.token) + '=', function (data) {
        self.classes = data;
      });
      app.request.json(feedbackDataURL + '&token=' + encodeURIComponent(self.student.token) + '=', function (data) {
        self.feedback = data;
      });    
    },
    cancelAutoUpdate: function() { clearInterval(this.timer) }
  },
  mounted: function() {
    const self = this;
    const app = self.$f7;
    self.student = JSON.parse(localStorage.getItem('student')) ? JSON.parse(localStorage.getItem('student')) : {'first':'','last':'','token':'','statusID':'','statusMessage':''};
    app.request.json(calendarDataURL + '&token=' + encodeURIComponent(self.student.token) + '=', function (data) {
      self.calendar = data;
    });
    app.request.json(classesDataURL + '&token=' + encodeURIComponent(self.student.token) + '=', function (data) {
      self.classes = data;
    });
    app.request.json(feedbackDataURL + '&token=' + encodeURIComponent(self.student.token) + '=', function (data) {
      self.feedback = data;
    });    
  },
  beforeDestroy() {
    clearInterval(this.timer)
  },
  created: function() {
    $$('body').css('backgroundColor', '#ffffff');
    $$('#app').show();
    this.timer = setInterval(this.fetchEventsList, 300000);
  }
});

addToHomescreen({
  modal: true,
  maxDisplayCount: 0,
  startDelay: 2, // wait 2 seconds to display
  message: 'To add Academy to your home screen: tap %icon and then <strong>Add to Home Screen</strong>',
  displayPace: 5, // display every 5 minutes
  lifespan: 15
});

