// Import all images to ensure they are included in build
import bgCart from '../images/bg-cart.png';
import blanketCart from '../images/blanket-cart.png';
import borderCart from '../images/border-cart.png';
import firstCart from '../images/first-cart.png';
import secondCart from '../images/second-cart.png';
import thirdCart from '../images/third-cart.png';
import logo1Part1 from '../images/logo1-part1.png';
import logo1Part2 from '../images/logo1-part2.png';
import man1Part1 from '../images/man1-part1.png';
import man1Part2 from '../images/man1-part2.png';
import man2Part1 from '../images/man2-part1.png';
import man2Part2 from '../images/man2-part2.png';
import scratch from '../images/scratch.png';

// Export images for use in other modules
export const images = {
  bgCart,
  blanketCart,
  borderCart,
  firstCart,
  secondCart,
  thirdCart,
  logo1Part1,
  logo1Part2,
  man1Part1,
  man1Part2,
  man2Part1,
  man2Part2,
  scratch
};

// Helper function to get image URL
export function getImageUrl(imageName) {
  return images[imageName] || null;
}