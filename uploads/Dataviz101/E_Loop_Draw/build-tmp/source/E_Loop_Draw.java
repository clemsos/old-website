import processing.core.*; 
import processing.data.*; 
import processing.event.*; 
import processing.opengl.*; 

import java.util.HashMap; 
import java.util.ArrayList; 
import java.io.File; 
import java.io.BufferedReader; 
import java.io.PrintWriter; 
import java.io.InputStream; 
import java.io.OutputStream; 
import java.io.IOException; 

public class E_Loop_Draw extends PApplet {

// init
public void setup() {

  size(500, 500);
  color(0);
  frameRate(24); // 10 par d\u00e9faut

  println("c'est parti");
}

public void draw() {
  
  println("d\u00e9compte : ", frameCount); // d\u00e9compte des images
  println("heure :", hour(), minute(), second()); // affiche l'heure
  
  println("souris X: ", mouseX, "souris Y: ",  mouseY); // affiche les coordonn\u00e9es de la souris
  
  line(random(50,450),random(50,450),random(50,450),random(50,450)); // random(high) or random(low, high)
}
  static public void main(String[] passedArgs) {
    String[] appletArgs = new String[] { "E_Loop_Draw" };
    if (passedArgs != null) {
      PApplet.main(concat(appletArgs, passedArgs));
    } else {
      PApplet.main(appletArgs);
    }
  }
}
