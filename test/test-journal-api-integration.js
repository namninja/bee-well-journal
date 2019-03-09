function seedBlogData() {
    console.info('seeding blog data');
    const seedData = [];
  
    for (let i=1; i<=31; i++) {
      seedData.push(generateBlogData());
    }
    // this will return a promise
    return Journal.insertMany(seedData);
  }
function generateBlogData() {
    var things = []
    for (let i =0; i < 3 ; i++ ){
        things.push(faker.lorem.sentence())
    }
    var thingsfive = [] 
    for (let i =0; i < 5 ; i++ ){
        thingsfive.push(faker.lorem.sentence())
    }
    var thingsthree = [] 
    for (let i =0; i < 3 ; i++ ){
        thingsthree.push(faker.lorem.words(1))
    }
  
       return {
  morningRating: faker.random.number(10) ,
  excitedAbout: things,
  priorities:  thingsfive,
  eveningRating: faker.random.number(10),
  describeToday: thingsthree,
  todayWins: things,
  toImprove: faker.lorem.sentences(),
  gratitude: things,
  journalEntry: faker.lorem.sentences(),
  user: "5c8324506c9fbb5e7081ec21"
      
    };
  }
 seedBlogData();