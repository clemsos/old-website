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

public class C_Texte extends PApplet {

//Tout d'abord, initialisons une cha\u00eene de caract\u00e8res texte
String text;

public void setup() {
    
    print("Hello World !");
        
    //ensuite, on \u00e9crit notre texte
    text = "J'essaie de trouver le nombre de caract\u00e8res de cette cha\u00eene.";
    

    int nb_caracteres = text.length();// la longueur de la cha\u00eene texte
    print("Nb de caract\u00e8res : " + nb_caracteres);//et il ne reste plus qu'\u00e0 afficher
}
  static public void main(String[] passedArgs) {
    String[] appletArgs = new String[] { "C_Texte" };
    if (passedArgs != null) {
      PApplet.main(concat(appletArgs, passedArgs));
    } else {
      PApplet.main(appletArgs);
    }
  }
}
