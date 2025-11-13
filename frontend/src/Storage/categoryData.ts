import airPods from "../images/AirPods.png";
import iphone from "../images/case.png";
import ipad from "../images/ipad.png";
import iwatch from "../images/iwatch.png";
import test from "../images/test.png";

interface Category {
  id: number;
  img: string;
  text: string;
}

const categoryData: Category[] = [
  { id: 1, img: "../images/test.png", text: "Костюми" },
  { id: 2, img: test, text: "Худі" },
  { id: 3, img: test, text: "Спортивні штани" },
  { id: 4, img: test, text: "Кофти" },
  { id: 5, img: test, text: "Футболки" },
  { id: 6, img: test, text: "ще щось" },
  { id: 7, img: test, text: "ще щось" },
  { id: 8, img: test, text: "ще щось" },
];

export default categoryData;
