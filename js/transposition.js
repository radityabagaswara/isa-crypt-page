const chars = "abcdefghijklmnopqrstuvwxyz";

function crypt(plaintext, key, pc = "x") {
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

function decrypt(ciphertext, keyword) {
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
    return plaintext.replace(/(x)/g, "");
}