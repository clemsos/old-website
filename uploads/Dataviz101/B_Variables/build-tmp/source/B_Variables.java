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

public class B_Variables extends PApplet {
  public void setup() {
int nombre_entier = 32; // integer
float nombre_a_virgule = 0.33f; // floating point, virgule flottante

char caractere='$'; // character (attention : guillemet simple !)
String chaine_de_caracteres="bonjour"; // une cha\u00eene de caract\u00e8re

int yellow = 0xffFFCC00;
    noLoop();
  }

  static public void main(String[] passedArgs) {
    String[] appletArgs = new String[] { "B_Variables" };
    if (passedArgs != null) {
      PApplet.main(concat(appletArgs, passedArgs));
    } else {
      PApplet.main(appletArgs);
    }
  }
}
