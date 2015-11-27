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

public class I_Dataviz extends PApplet {

/*

Compter les occurences des lettres dans les diff\u00e9rents livres.

Tout les textes viennent du site Gutenberg Project

The Life and Adventures of Robinson Crusoe, by Daniel Defoe
http://www.gutenberg.org/files/521/521-0.txt

Huckleberry Finn, by Mark Twain
http://www.gutenberg.org/cache/epub/76/pg76.txt

Frankenstein, by Mary Shelley 
http://www.gutenberg.org/cache/epub/84/pg84.txt

*/

String[] txt;//tableau de cha\u00eene de caract\u00e8re ("phrase"), contient toutes les lignes de notre texte

int[] nbLettres;// tableau de nombre entier (Integer), pour compter le nombre de 'A',  de 'B', de 'C', ... : on a un nombre pour chaque lettre

int nbTotal;// variable pour le nombre total de lettre dans le texte

String alphabet="ABCDEFGHIJKLMNOPQRSTUVWXYZ"; // liste de caract\u00e8res repr\u00e9sentant l'alphabet latin

// String book_url="http://www.gutenberg.org/cache/epub/84/pg84.txt";
String bookUrl="./data/frankenstein.txt";

public void setup() {
    size(700, 700);
    smooth();
    background(255);
    noStroke();

    // d\u00e9compte des lettres
    nbLettres= new int[26];// on a besoin de 26 valeurs pour les 26 lettres
    for (int i=0; i<nbLettres.length; i++) {//initialisation des variables du tableau
        nbLettres[i]=0;//pour le moment on 0(z\u00e9ro) A, 0 B, 0 C, ...
    }

/////////////////////////////OBTENIR LES DONN\u00c9ES 

    // on charge ici un document (fichier texte) depuis une adresse absolue (comme une adresse internet) ou un fichier 
    txt=loadStrings(bookUrl);
    // println(txt); //affichage du texte (tableau de phrases)

    // le tableau obtenu contient toutes les lignes de texte
    println("nbre de lignes: "+txt.length);

///////////////////////////// MISE EN FORME ET ANALYSE

    for (int i = 0; i < txt.length; ++i) { // pour chaque ligne
        
        String ligne=txt[i].toUpperCase(); //mise en majuscule de la ligne i 

        for (int j = 0; j < ligne.length(); ++j) { // pour chaque caract\u00e8re j de la ligne i
            
            char lettre=ligne.charAt(j); // le caract\u00e8re \u00e0 la position 'j' de la ligne
            int index_de_la_lettre=alphabet.indexOf(lettre); // trouver la position de la lettre dans l'alphabet

            if(index_de_la_lettre != -1) { // v\u00e9rifier que la lettre existe bien dans l'alphabet (exclure les autres caract\u00e8res)

                nbLettres[index_de_la_lettre]++; // on ajoute +1 \u00e0 notre d\u00e9compte
                nbTotal++; // un compte total des lettres

            }

            
        }
    }

    /////////////////////////////AFFICHAGE DES R\u00c9SULTATS
    println("tableau de lettres:");//on peut faire println("du textte");
    println(nbLettres);//on peut faire println(une_variable);
    println("nbre total de lettres: "+nbTotal);//on peut faire println("du texte" + une_variable);
    println("min: "+ min(nbLettres)+"    max: "+ max(nbLettres));
    //min(tableau) permet d'avoir la plus petite valeur d'un tableau
    //max(tableau) permet d'avoir la plus grande valeur d'un tableau
    
}

public void draw() {
    //  mode1();//on appelle la m\u00e9thode "mode1()" situ\u00e9e dans l'onglet "Modes". Choisir le mode entre 1 et 3

    /*
    // MODE 1 
    for (int i=0; i<26; i++) {
        fill(0);

        if(nbLettres[i] == max(nbLettres)){fill(255,0,0);} // highlight 

        float largeur =map(nbLettres[i], min(nbLettres), max(nbLettres), 5, width-40-60);
        rect(40, 25+i*25, largeur, 20);
        //la fonction map(variable, val1, val2, val3, val4) permet de faire des rapports de valeurs (rapport en croix par exemple)
        // ici, on s'en sert pour adapter la longueur de la barre \u00e0 la taille de l'affichage
        
        //textes
        fill(0);
        textAlign(LEFT);
        text(char(65+i), 20, 39+i*25);//utilisation du code ASCII pour afficher le caract\u00e8re
        textAlign(RIGHT);
        text(nbLettres[i], width-20, 39+i*25);
    }
    */

    // MODE 2 
    for (int i=0; i<26; i++) {
        fill(0);
        String[] fontList = PFont.list();
        fill(0, map(nbLettres[i], min(nbLettres), max(nbLettres), 255, 150));
        textFont(createFont(fontList[i], map(nbLettres[i], min(nbLettres), max(nbLettres), 20, 220)));
        textAlign(CENTER);
        text(PApplet.parseChar(65+i), // letter
            // X
            random(map(nbLettres[i], min(nbLettres), max(nbLettres), 20, 150), width-map(nbLettres[i], min(nbLettres), max(nbLettres), 20, 150)), 
            // Y
            random(map(nbLettres[i], min(nbLettres), max(nbLettres), 20, 150), height-map(nbLettres[i], min(nbLettres), max(nbLettres), 20, 150)));
    }

    noLoop();//pas besoin de faire tourner draw() en boucle une fois l'affichage fait

}
//On peut cr\u00e9er d'autres onglets dans Processing pour s\u00e9parer les diff\u00e9rents \u00e9l\u00e9ments du code, pour les retrouver plus facilement
//Pour cela il suffit de cliquer sur la fl\u00e8che tout \u00e0 droite de la fen\u00eatre et ensuite sur New Tab  ------------------------------------------------------>

public void mode1() {//visualisation des donn\u00e9es les unes par rapport aux autres
  for (int i=0; i<26; i++) {//pour chaque lettre
    //rectangles
    if (nbLettres[i]==max(nbLettres)) {//SI le compteur de la lettre 'i' est \u00e9gal \u00e0 la valeur max
      fill(255, 0, 0);
    }
    else if (nbLettres[i]==min(nbLettres)) {//OU SI le compteur de la lettre 'i' est \u00e9gal \u00e0 la valeur min
      fill(150, 150, 255);
    }
    else {//SINON
      fill(0);
    }

    rect(40, 25+i*25, map(nbLettres[i], min(nbLettres), max(nbLettres), 5, width-40-60), 20);
    //la fonction map(variable, val1, val2, val3, val4) permet de faire des rapports de valeurs simplifi\u00e9s:
    //pour une variable qui va dans une fourchette de valeurs entre val1 et val2, on va la situer dans une nouvelle fourchette entre val3 et val4
    //donc si notre variable=val1(min de la 1\u00e8re fourchette), on obtiendra val3(min de la 2nde fourchette)
    //si notre variable=val2(max de la 1\u00e8re fourchette), on obtiendra val4(max de la 2nde fourchette)
    //si c'est la moiti\u00e9 de la premi\u00e8re, on aura la moiti\u00e9 de la seconde, et si c'est 64.75% de la premi\u00e8re, on laisse l'ordinateur faire les calculs...
    
    //textes
    fill(0);
    textAlign(LEFT);
    text(PApplet.parseChar(65+i), 20, 39+i*25);//utilisation du code ASCII pour afficher le caract\u00e8re
    textAlign(RIGHT);
    text(nbLettres[i], width-20, 39+i*25);
  }
}


//ici 2 autres modes Bonus: je vous laisse regarder les r\u00e9f\u00e9rences sur processing.org pour les "arc" et la trigo sur http://processing.org/learning/trig/
//petit rappel de trigo pour le mode2 (Processing vous r\u00e9conciliera avec certaines notions math\u00e9matiques qui para\u00eessent totalement abstraites, je parle de v\u00e9cu)
//float x = cos(radians(angle)) * radius; radians(pour_un_angle_en_degr\u00e9s) sinon pas radians() si on parle d'un angle entre 0 et TWO_PI
//float y = sin(radians(angle)) * radius;

public void mode2() {//visualisation des donn\u00e9es par rapport \u00e0 l'ensemble du texte, on se rend compte de la place occup\u00e9e par une lettre dans l'ensemble du texte
  int nb=0;
  for (int i=0; i<26; i++) {//pour chaque lettre
    colorMode(HSB);//au lieu du mode RVB utilis\u00e9 par d\u00e9faut dans Processing, on utilise ici le mode HSB: Hue, Saturation, Brightness (ou TSL en Fran\u00e7ais: Teinte, Saturation, Luminosit\u00e9)
    fill(map(nbLettres[i], min(nbLettres), max(nbLettres), 130, 255), 220, 255);
    arc(width/2, height/2, width-40, width-40, radians(map(nb, 0, nbTotal, 0, 360)-1), radians(map(nb+nbLettres[i], 0, nbTotal, 0, 360)));
    
    fill(map(nbLettres[i], min(nbLettres), max(nbLettres), 130, 255), 220, 255);
    textAlign(CENTER);
    text(PApplet.parseChar(65+i), width/2+ (width/2-10) * cos(radians(map(nb+nbLettres[i]/2, 0, nbTotal, 0, 360)-1)), height/2+6+ (width/2-10) * sin(radians(map(nb+nbLettres[i]/2, 0, nbTotal, 0, 360)-1)));
    nb+=nbLettres[i];
  }
  
  fill(255);
  ellipse(width/2, height/2, width-200, width-200);//rond blanc au centre 

  fill(0);
  textAlign(LEFT);
  text("Nombre total de lettres: "+nbTotal, 200, height/2-20);
  text("Minimum: "+ min(nbLettres), 200, height/2);
  text("Maximum: "+ max(nbLettres), 200, height/2+20);
}

public void mode3() {//repr\u00e9sentation plus imag\u00e9e des donn\u00e9es
  fill(0);
  for (int i=0; i<26; i++) {
    String[] fontList = PFont.list();
    fill(0, map(nbLettres[i], min(nbLettres), max(nbLettres), 255, 150));
    textFont(createFont(fontList[i], map(nbLettres[i], min(nbLettres), max(nbLettres), 20, 220)));
    textAlign(CENTER);
    text(PApplet.parseChar(65+i), 
    random(map(nbLettres[i], min(nbLettres), max(nbLettres), 20, 150), width-map(nbLettres[i], min(nbLettres), max(nbLettres), 20, 150)), 
    random(map(nbLettres[i], min(nbLettres), max(nbLettres), 20, 150), height-map(nbLettres[i], min(nbLettres), max(nbLettres), 20, 150)));
  }
}
  static public void main(String[] passedArgs) {
    String[] appletArgs = new String[] { "I_Dataviz" };
    if (passedArgs != null) {
      PApplet.main(concat(appletArgs, passedArgs));
    } else {
      PApplet.main(appletArgs);
    }
  }
}
