MATCH (j:JTBD)-[r:READS]->(d:Data) WITH j, count(r) as readers SET j.readers = readers * 1;
MATCH (j:JTBD)-[u:UPDATES]->(d:Data) WITH j, count(u) as updaters SET j.updaters = updaters * 3;
MATCH (j:JTBD)-[w:WRITES]->(d:Data) WITH j, count(w) as writers SET j.writers = writers * 5;

MATCH (d:Data)<-[r:READS]-() WITH d, count(r) as readers SET d.readers = readers;

MATCH (j:JTBD)<-[d:DOES]-() WITH j, count(d) as actor_multiplyer SET j.actor_multiplyer = actor_multiplyer;

WITH 1 as READ_COMPLEXITY, 3 as UPDATE_COMPLEXITY, 5 as WRITE_COMPLEXITY
MATCH (j:JTBD) SET j.complexity = 
((j.readers * READ_COMPLEXITY)
+ (j.updaters * UPDATE_COMPLEXITY)
+ (j.writers * WRITE_COMPLEXITY)) * j.actor_multiplyer
SET j.estimate = (j.complexity * 1.8) + ' days';

MATCH (d:Data) WHERE d.readers > 1 SET d.complexity = 10, d.estimate = (10 * 1.8) + ' days';