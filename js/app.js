const modulus = 26;
const alph = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z'];
const table = {
    a: "abcdefghijklmnopqrstuvwxyz",
    b: "bcdefghijklmnopqrstuvwxyza",
    c: "cdefghijklmnopqrstuvwxyzab",
    d: "defghijklmnopqrstuvwxyzabc",
    e: "efghijklmnopqrstuvwxyzabcd",
    f: "fghijklmnopqrstuvwxyzabcde",
    g: "ghijklmnopqrstuvwxyzabcdef",
    h: "hijklmnopqrstuvwxyzabcdefg",
    i: "ijklmnopqrstuvwxyzabcdefgh",
    j: "jklmnopqrstuvwxyzabcdefghi",
    k: "klmnopqrstuvwxyzabcdefghij",
    l: "lmnopqrstuvwxyzabcdefghijk",
    m: "mnopqrstuvwxyzabcdefghijkl",
    n: "nopqrstuvwxyzabcdefghijklm",
    o: "opqrstuvwxyzabcdefghijklmn",
    p: "pqrstuvwxyzabcdefghijklmno",
    q: "qrstuvwxyzabcdefghijklmnop",
    r: "rstuvwxyzabcdefghijklmnopq",
    s: "stuvwxyzabcdefghijklmnopqr",
    t: "tuvwxyzabcdefghijklmnopqrs",
    u: "uvwxyzabcdefghijklmnopqrst",
    v: "vwxyzabcdefghijklmnopqrstu",
    w: "wxyzabcdefghijklmnopqrstuv",
    x: "xyzabcdefghijklmnopqrstuvw",
    y: "yzabcdefghijklmnopqrstuvwx",
    z: "zabcdefghijklmnopqrstuvwxy"
}
const chars = "abcdefghijklmnopqrstuvwxyz%";

function encryptAll(text, affineKeyA, affineKeyB, vigenereKey, transKey) {
    const cAffine = AffineCrypt(text, Number(affineKeyA), Number(affineKeyB), modulus);
    console.log("[Encryprt Affine]", cAffine);

    const cVigenere = VigenereCrypt(cAffine, vigenereKey);
    console.log("[Encryprt Vigenere]", cVigenere);

    const cTrans = TranspositionCrypt(cVigenere, transKey, "%");
    console.log("[Encryprt Transposition]", cTrans);

    console.log("");
    return cTrans;
}

function decryptAll(text, affineKeyA, affineKeyB, vigenereKey, transKey){
    console.log("");
    const dTrans = TranspositionDecrypt(text, transKey);
    console.log("[Decrypt Transposition]", dTrans);

    const dVigenere = VigenereDecrypt(dTrans, vigenereKey);
    console.log("[Decrypt Vigenere]", dVigenere);

    const dAffine = AffineDecrypt(dVigenere, Number(affineKeyA), Number(affineKeyB), modulus);
    console.log("[Decrypt Affine]", dAffine);

    return dAffine;
}


function AffineCrypt(w, a, b) {
    let pop = w.split('');
    let crypt1 = [];
    pop.forEach(e => {
        const hsl = mod((a * alph.indexOf(e) + b), modulus);
        const cr = alph[hsl];
        crypt1.push(cr);
    });

    return crypt1.join('');
}

function AffineDecrypt (w, a, b) {
    const modInv = invModulo(a, modulus);
    let pop = w.split('');
    let dcr = [];

    pop.forEach(e => {
        const hsl = mod(modInv * (alph.indexOf(e) - b), modulus);
        const cr = alph[Math.abs(hsl)];
        dcr.push(cr);
    });

    return dcr.join('');
}

function VigenereCrypt(plainText, keyword) {
    let encTxt = "";
    let spCharaCount = 0;

    for( let i = 0; i < plainText.length; i++ ){
      let key = (i - spCharaCount) % keyword.length;
      let keywordIndex = table.a.indexOf(keyword[key]);

      if(table[plainText[i]] ){
        encTxt += table[plainText[i]][keywordIndex];
      }else{
        encTxt += plainText[i];
        spCharaCount++;
      }
    }

    return encTxt;
} 

function VigenereDecrypt(encTxt, keyword) {
    encTxt = encTxt.toLowerCase();
    keyword = keyword;

    let decryptedText = "";
    let spCharaCount = 0;

    for( let i = 0; i < encTxt.length; i++ ){
      let key = (i - spCharaCount) % keyword.length;
      let keyRow = table[keyword[key]];

      if( keyRow.indexOf(encTxt[i]) !== -1 ){
        decryptedText += table.a[keyRow.indexOf(encTxt[i])];
      }else{
        decryptedText += encTxt[i];
        spCharaCount++;
      }
    }

    return decryptedText;
}

function TranspositionCrypt(plaintext, key, pc = "%") {
    let klen = key.length;
    while (plaintext.length % klen != 0) {
        plaintext += pc.charAt(0);
    }
    let colLength = plaintext.length / klen;
    let ciphertext = "";
    k = 0;
    for (i = 0; i < klen; i++) {
        while (k < 26) {
            t = key.indexOf(chars.charAt(k));
            arrkw = key.split("");
            arrkw[t] = "_";
            key = arrkw.join("");
            if (t >= 0) break;
            else k++;
        }
        for (j = 0; j < colLength; j++) {
            ciphertext += plaintext.charAt(j * klen + t);
        }
    }
    return ciphertext;
}

function TranspositionDecrypt(ciphertext, keyword) {
    let klen = keyword.length;
    let cols = new Array(klen);
    let colLength = ciphertext.length / klen;
    for (i = 0; i < klen; i++) cols[i] = ciphertext.substr(i * colLength, colLength);
    let newcols = new Array(klen);
    j = 0;
    i = 0;
    while (j < klen) {
        t = keyword.indexOf(chars.charAt(i));
        if (t >= 0) {
            newcols[t] = cols[j++];
            arrkw = keyword.split("");
            arrkw[t] = "_";
            keyword = arrkw.join("");
        } else i++;
    }
    let plaintext = "";
    for (i = 0; i < colLength; i++) {
        for (j = 0; j < klen; j++) {
           plaintext += newcols[j].charAt(i);
        }
    }
    return plaintext.replace(/(%)/g, "");
}

function invModulo (num, mod)  {
        for (let x = 1; x < mod; x++) {
        if (((num % mod) * (x % mod)) % mod == 1)
            return x;
    }
}

function mod (n, m)  {
    var remain = n % m;
    return Math.floor(remain >= 0 ? remain : remain + m);
}