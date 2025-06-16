NoSQL Deney Sonu Mini Proje ve Raporu
=================================

NoSQL deneyinde kullanılan Redis, Hazelcast ve MongoDB teknolojileri kullanarak 3 farklı endpoint ile hizmet veren bir servis tasarlanması beklenmektedir. Her 3 teknolojide de 10.000 kayıtlık bir veri tabanı girişi yapılması gerekmektedir.

Tutulacak kayıt:
`student.json`
```json
 "student_no" : "111111",
 "name" : "Münip Utandı":
 "department" : "Classical Turkish Music"

 "student_no" : "111112",
 "name" : "Nağme Yarkın":
 "department" : "Classical Turkish Music"

 "student_no" : "111113",
 "name" : "Aysun Gültekin":
 "department" : "Turkish Folk Music"
```

Uygulamanın başlangıç aşamasında 10.000 adet kaydı, veritabanlarına rastgele oluşturup ekletebilirsiniz. Veya anlamlı bir kayıt girişi de yapabilirsiniz.

1. endpoint doğrudan redis-ten alıp getirmelidir.
2. endpoint doğrudan hazelcast-ten alıp getirmelidir.
3. endpoint doğrudan mongodb-den alıp getirmelidir.

`URL1: localhost:8080/nosql-lab-rd/student_no=xxxxxxxxxx`\
`URL2: localhost:8080/nosql-lab-hz/student_no=xxxxxxxxxx`\
`URL3: localhost:8080/nosql-lab-mon/student_no=xxxxxxxxxx`


Şablon proje dizini:
```
src/
└── main/
    ├── java/
    │   └── app/
    │       ├── Main.java
    │       ├── model/Student.java
    │       ├── store/RedisStore.java
    │       ├── store/HazelcastStore.java
    │       └── store/MongoStore.java
```

Kodladığınız endpoint-leri test etmek için siege komutunu yükleyiniz. (1000 istek, eş zamanlı 10 istemci)
`sudo apt-get install siege`
```bash
    # Redis
    siege -H "Accept: application/json" -c10 -r100 "http://localhost:8080/nosql-lab-rd/student_no=2025000001" > ~/redis-siege.results
    
    # Hazelcast
    siege -H "Accept: application/json" -c10 -r100 "http://localhost:8080/nosql-lab-hz/student_no=2025000001" > ~/hz-siege.results

    # MongoDB
    siege -H "Accept: application/json" -c10 -r100 "http://localhost:8080/nosql-lab-mon/student_no=2025000001" > ~/mongodb-siege.results
```
Sonuçlar standart çıkışa değil `*.results` isimli dosyalara bastırabilir. Sonuçları bu dosyalardan alıp, raporunuza ekleyebilirsiniz.

siege komutu parametreleri:
* H : gelen yanıt bir json verisi
* c10: 10 eş zamanlı istemci (concurrent users)
* r100: Her istemci 100 istek atsın (10x100 = toplam 1000 istek)
* "URL": Test etmek istediğin endpoint


Rapora eklenecek sonuçlar:
```
    Transactions:                   1000 hits
    Availability:                 100.00 %
    Elapsed time:                  10.34 secs
    Data transferred:               0.80 MB
    Response time:                  0.08 secs
    Transaction rate:              96.71 trans/sec
    Throughput:                     0.08 MB/sec
    Concurrency:                    7.89
    Successful transactions:        1000
    Failed transactions:               0
```
\
Koşum zamanı testi:
```bash
    time seq 1 100 | xargs -n1 -P10 -I{} curl -s "http://localhost:8080/nosql-lab-rd/student_no=2025000001" > ~/redis-time.results

    time seq 1 100 | xargs -n1 -P10 -I{} curl -s "http://localhost:8080/nosql-lab-rd/student_no=2025000001" > ~/hz-time.results

    time seq 1 100 | xargs -n1 -P10 -I{} curl -s "http://localhost:8080/nosql-lab-mon/student_no=2025000001" > ~/mongodb-time.results
```
```
    Execution time:               0.xxxx
```
\
`git clone https://github.com/ismailhakkituran/dbms-lab-nosql.git` komutu ile şablonu çalışma dizininize kopyalayıp, `idea .` IDE kullanarak proje şeklinde açabilirsiniz.
\
**(\*)** Deney kapsamında verilen bu çalışmayı hayal gücünüzle geliştirip, CV' nize eklemeniz tavsiye edilir.


