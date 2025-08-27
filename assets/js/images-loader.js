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

// Wheel images
import wheelPart1 from '../images/wheel-part1.png';
import wheelPart2 from '../images/wheel-part2.png';
import wheelPart3 from '../images/wheel-part3.png';
import wheelPart4 from '../images/wheel-part4.png';
import wheelPart5 from '../images/wheel-part5.png';
import wheelPart6 from '../images/wheel-part6.png';
import wheelText1 from '../images/wheel-text1.png';
import wheelText2 from '../images/wheel-text2.png';
import arrowPart1 from '../images/arrow-part1.png';
import arrowPart2 from '../images/arrow-part2.png';

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
  scratch,
  // Wheel images
  wheelPart1,
  wheelPart2,
  wheelPart3,
  wheelPart4,
  wheelPart5,
  wheelPart6,
  wheelText1,
  wheelText2,
  arrowPart1,
  arrowPart2
};

// Helper function to get image URL
export function getImageUrl(imageName) {
  return images[imageName] || null;
}