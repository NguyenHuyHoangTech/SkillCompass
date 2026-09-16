export interface Course {
  id: string;
  title: string;
  instructor: string;
  provider: string;
  rating: number;
  reviewsCount: number;
  level: string;
  duration: string;
  price: string;
  imageUrl: string;
  tags: string[];
}

export const mockCoursesData: Course[] = [
  {
    id: "c-1",
    title: "Meta Front-End Developer Professional Certificate",
    instructor: "Meta Staff",
    provider: "Meta",
    rating: 4.8,
    reviewsCount: 14502,
    level: "Beginner",
    duration: "7 months",
    price: "Free to enroll",
    imageUrl: "https://images.unsplash.com/photo-1633356122544-f134324a6cee?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    tags: ["Frontend", "React", "Best Seller"]
  },
  {
    id: "c-2",
    title: "Google UX Design Professional Certificate",
    instructor: "Google Career Certificates",
    provider: "Google",
    rating: 4.9,
    reviewsCount: 78923,
    level: "Beginner",
    duration: "6 months",
    price: "Free to enroll",
    imageUrl: "https://images.unsplash.com/photo-1561070791-2526d30994b5?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    tags: ["UI/UX", "Design", "Popular"]
  },
  {
    id: "c-3",
    title: "Generative AI with Large Language Models",
    instructor: "Andrew Ng",
    provider: "DeepLearning.AI",
    rating: 4.9,
    reviewsCount: 12450,
    level: "Intermediate",
    duration: "3 weeks",
    price: "$49/month",
    imageUrl: "https://images.unsplash.com/photo-1677442136019-21780ecad995?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    tags: ["AI", "Machine Learning", "Trending"]
  },
  {
    id: "c-4",
    title: "Advanced CSS and Sass: Flexbox, Grid, Animations",
    instructor: "Jonas Schmedtmann",
    provider: "Udemy",
    rating: 4.8,
    reviewsCount: 35000,
    level: "Intermediate",
    duration: "28 hours",
    price: "$19.99",
    imageUrl: "https://images.unsplash.com/photo-1507721999472-8ed4421c4af2?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    tags: ["Frontend", "CSS", "UI"]
  },
  {
    id: "c-5",
    title: "Microfrontends with React: A Complete Developer's Guide",
    instructor: "Stephen Grider",
    provider: "Udemy",
    rating: 4.7,
    reviewsCount: 8200,
    level: "Advanced",
    duration: "10 hours",
    price: "$24.99",
    imageUrl: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    tags: ["Frontend", "Architecture", "React"]
  },
  {
    id: "c-6",
    title: "IBM Backend Development Professional Certificate",
    instructor: "IBM Skills Network",
    provider: "IBM",
    rating: 4.6,
    reviewsCount: 5400,
    level: "Beginner",
    duration: "5 months",
    price: "Free to enroll",
    imageUrl: "https://images.unsplash.com/photo-1623479322729-28b25c16b011?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    tags: ["Backend", "Python", "Cloud"]
  },
  {
    id: "c-7",
    title: "Three.js and WebGL 3D Development",
    instructor: "Bruno Simon",
    provider: "Three.js Journey",
    rating: 5.0,
    reviewsCount: 22000,
    level: "All Levels",
    duration: "50 hours",
    price: "$95.00",
    imageUrl: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    tags: ["Frontend", "3D", "WebXR"]
  },
  {
    id: "c-8",
    title: "Building Agentic Applications with LangChain",
    instructor: "Harrison Chase",
    provider: "DeepLearning.AI",
    rating: 4.8,
    reviewsCount: 3100,
    level: "Advanced",
    duration: "2 weeks",
    price: "Free",
    imageUrl: "https://images.unsplash.com/photo-1620712943543-bcc4688e7485?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    tags: ["AI", "Agents", "Trending"]
  }
];
