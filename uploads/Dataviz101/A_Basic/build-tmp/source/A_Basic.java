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

public class A_Basic extends PApplet {

public void setup(){
  size(300, 300);
  background(0); 
}
 
// un commentaire
public void draw(){
    fill(12, 15, 16, .7f);
    text("Hello, world!", width/2, height/2+50);
    rect(20, 20, width/2, height/2);
}
  static public void main(String[] passedArgs) {
    String[] appletArgs = new String[] { "A_Basic" };
    if (passedArgs != null) {
      PApplet.main(concat(appletArgs, passedArgs));
    } else {
      PApplet.main(appletArgs);
    }
  }
}
