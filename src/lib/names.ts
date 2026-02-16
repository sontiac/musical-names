// Curated list of popular English first names — mix of classic, modern, male, female
const NAMES: string[] = [
  "James", "Mary", "John", "Patricia", "Robert", "Jennifer", "Michael", "Linda",
  "William", "Elizabeth", "David", "Barbara", "Richard", "Susan", "Joseph", "Jessica",
  "Thomas", "Sarah", "Charles", "Karen", "Christopher", "Lisa", "Daniel", "Nancy",
  "Matthew", "Betty", "Anthony", "Margaret", "Mark", "Sandra", "Donald", "Ashley",
  "Steven", "Kimberly", "Paul", "Emily", "Andrew", "Donna", "Joshua", "Michelle",
  "Kenneth", "Dorothy", "Kevin", "Carol", "Brian", "Amanda", "George", "Melissa",
  "Timothy", "Deborah", "Ronald", "Stephanie", "Edward", "Rebecca", "Jason", "Sharon",
  "Jeffrey", "Laura", "Ryan", "Cynthia", "Jacob", "Kathleen", "Gary", "Amy",
  "Nicholas", "Angela", "Eric", "Shirley", "Jonathan", "Anna", "Stephen", "Brenda",
  "Larry", "Pamela", "Justin", "Emma", "Scott", "Nicole", "Brandon", "Helen",
  "Benjamin", "Samantha", "Samuel", "Katherine", "Raymond", "Christine", "Gregory", "Debra",
  "Frank", "Rachel", "Alexander", "Carolyn", "Patrick", "Janet", "Jack", "Catherine",
  "Dennis", "Maria", "Jerry", "Heather", "Tyler", "Diane", "Aaron", "Ruth",
  "Jose", "Julie", "Adam", "Olivia", "Nathan", "Joyce", "Henry", "Virginia",
  "Peter", "Victoria", "Zachary", "Kelly", "Douglas", "Lauren", "Harold", "Christina",
  "Noah", "Joan", "Ethan", "Evelyn", "Arthur", "Judith", "Liam", "Megan",
  "Mason", "Andrea", "Logan", "Cheryl", "Lucas", "Hannah", "Owen", "Jacqueline",
  "Aiden", "Martha", "Elijah", "Gloria", "Oliver", "Teresa", "Sebastian", "Ann",
  "Caleb", "Sara", "Leo", "Madison", "Gabriel", "Frances", "Sofia", "Sophia",
  "Luna", "Mia", "Isabella", "Charlotte", "Amelia", "Harper", "Aria", "Scarlett",
  "Aurora", "Grace", "Chloe", "Penelope", "Layla", "Riley", "Zoey", "Nora",
  "Lily", "Eleanor", "Hazel", "Violet", "Nova", "Isla", "Willow", "Ivy",
  "Stella", "Emilia", "Jade", "Ruby", "Ellie", "Alice", "Rose", "Lucy",
  "Miles", "Kai", "Adrian", "Felix", "Jasper", "Theo", "Axel", "Atlas",
  "River", "Phoenix", "Sienna", "Autumn", "Summer", "Willow", "Sage", "Rowan",
];

export function getRandomName(): string {
  return NAMES[Math.floor(Math.random() * NAMES.length)];
}
