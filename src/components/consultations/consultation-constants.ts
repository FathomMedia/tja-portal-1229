export const budgetIncludes = [
  {
    id: "international-flight-tickets",
    label: "internationalFlightTickets",
  },
  {
    id: "accommodation",
    label: "accommodation",
  },
  {
    id: "transport-and-fuel",
    label: "transportAndFuel",
  },
  {
    id: "activities",
    label: "activities",
  },
  {
    id: "attractions-fees",
    label: "sightseeingAndAttractionsFees",
  },
  {
    id: "travel-insurance",
    label: "travelInsurance",
  },
  {
    id: "travel-consultation-fees",
    label: "travelConsultationFees",
  },
] as const;

export const adventureToYouIs = [
  {
    id: "visiting-a-stunning-place-and-try-hard-to-climb-a-challenging-mountain-to-enjoy-a-panoramic-view-at-the-end",
    label: "visitingAStunningPlace",
  },
  {
    id: "being-out-in-wild-nature",
    label: "beingOutInWildNature",
  },
  {
    id: "over-coming-a-fear",
    label: "overComingAFear",
  },
  {
    id: "extreme-sports",
    label: "extremeSports",
  },
  {
    id: "beaches-and-water-sports",
    label: "BeachesAndWaterSports",
  },
  {
    id: "camping-outdoors",
    label: "campingOutdoors",
  },
  {
    id: "sightseeing-and-learning-about-new-cultures",
    label: "sightseeingAndLearning",
  },
  {
    id: "get-lost-somewhere-with-no-connection",
    label: "getLostSomewhere",
  },
  {
    id: "trying-new-activities-in-new-places",
    label: "TryingNewActivities",
  },
  {
    id: "national-parks-animals-and-wild-life",
    label: "nationalParksAndAnimals",
  },
] as const;

export const accommodationTypes = [
  { title: "aResortWith", imageUrl: "/assets/images/resort.jpg" },
  {
    title: "fiveStarHotel",
    imageUrl: "/assets/images/5-star-hotel.jpg",
  },
  { title: "romanticCabins", imageUrl: "/assets/images/cabins.jpg" },
  {
    title: "bedAndBreakfast",
    imageUrl: "/assets/images/bedAndBreakfast.jpg",
  },
  { title: "holidayHomes", imageUrl: "/assets/images/holidayHomes.jpg" },
  {
    title: "servicedApartments",
    imageUrl: "/assets/images/servicedApartments.jpg",
  },
  { title: "glamping", imageUrl: "/assets/images/glamping.jpg" },
  { title: "tents", imageUrl: "/assets/images/tents.jpg" },
  { title: "caravans", imageUrl: "/assets/images/caravans.jpg" },
  { title: "hostels", imageUrl: "/assets/images/hostels-image.jpg" },
  { title: "homestays", imageUrl: "/assets/images/homestays.jpg" },
  // Add more items as needed
];

export const cardOptionsSelect: {
  image: string;
  title: string;
  options: {
    id: string;
    label: string;
  }[];
}[] = [
  {
    image: "/assets/images/adrenalineAdventures.jpg",
    title: "adrenalineAdventures",
    options: [
      { id: "skydiving", label: "skydiving" },
      { id: "bungee-jumping", label: "bungeeJumping" },
      { id: "paragliding", label: "paragliding" },
    ],
  },
  {
    image: "/assets/images/outdoorsAdventures.jpg",
    title: "outdoorsAdventures",
    options: [
      { id: "snowmobiling", label: "snowmobiling" },
      { id: "cycling", label: "cycling" },
      { id: "camping", label: "camping" },
      { id: "hiking", label: "hiking" },
      { id: "via-ferrata", label: "viaFerrata" },
    ],
  },
  {
    image: "/assets/images/waterAdventures.jpg",
    title: "waterAdventures",
    options: [
      { id: "rafting", label: "rafting" },
      { id: "swimming", label: "swimming" },
      { id: "snorkelling", label: "snorkelling" },
      { id: "diving", label: "diving" },
      { id: "kayaking", label: "kayaking" },
      { id: "scuba-diving", label: "scubaDiving" },
    ],
  },
  {
    image: "/assets/images/skyAdventures.jpg",
    title: "skyAdventures",
    options: [
      { id: "helicopter-tours", label: "helicopterTours" },
      { id: "hot-air-balloon", label: "hotAirBalloon" },
      { id: "ziplining", label: "ziplining" },
    ],
  },
  {
    image: "/assets/images/wildlifeExperiences.jpg",
    title: "wildlifeExperiences",
    options: [
      { id: "horse-riding", label: "horseRiding" },
      { id: "safari-and-game-drives", label: "safariAndGameDrives" },
      { id: "kayak-with-penguins", label: "kayakWithPenguins" },
      { id: "diving-with-whale-sharks", label: "divingWithWhaleSharks" },
    ],
  },
  {
    image: "/assets/images/culturalExperiences.jpg",
    title: "culturalExperiences",
    options: [
      {
        id: "cultural-tours-and-workshops",
        label: "culturalToursAndWorkshops",
      },
      { id: "cooking-classes", label: "cookingClasses" },
    ],
  },
];

export const activitiesOptions = [
  ...cardOptionsSelect.map((i) => [...i.options]).flat(),
];

export const accommodationOptions = [
  ...accommodationTypes.map((i) => [i.title]).flat(),
];
