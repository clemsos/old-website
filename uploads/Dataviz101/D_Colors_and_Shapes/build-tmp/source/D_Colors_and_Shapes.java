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

public class D_Colors_and_Shapes extends PApplet {
  public void setup() {
int blue= color(36,164,248); //color(R,G,B);
int orange= color(232,140,12,200); //color(R,G,B,a), 255 means 100% opacity.
int yellow= color(0xffFFCC00);

smooth();

size(200,200);              // taille de l'espace de travail
background(blue);           // fond bleu

stroke(yellow);             // trait jaune
line(1,1,200,200);          // line(x1, x2, y1, y2)

noStroke();                 // pas de contour/trait
fill(orange);               // remplissage orange

rect(50,50,100,100);        // rect(x, y, width, height);

noFill();                   // pas de remplissage
stroke(0);                  // noir

ellipse(100,100,90,90);     // ellipse(x, y, width, height);
ellipse(50,50,50,50);       // ellipse(x, y, width, height);
ellipse(150,150,50,50);     // ellipse(x, y, width, height);
    noLoop();
  }

  static public void main(String[] passedArgs) {
    String[] appletArgs = new String[] { "D_Colors_and_Shapes" };
    if (passedArgs != null) {
      PApplet.main(concat(appletArgs, passedArgs));
    } else {
      PApplet.main(appletArgs);
    }
  }
}
