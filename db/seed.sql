-- ============================================================
-- SEED DATA — "The Locked Room Murder" (Case #1024)
-- ============================================================
-- A complete sample murder case for demo/testing
-- ============================================================

OPEN SCHEMA INVESTIGATION;

-- -----------------------------------------------------------
-- CASE
-- -----------------------------------------------------------
INSERT INTO INVESTIGATION.CASES (case_id, title, description, status, current_stage, confidence)
VALUES (
    'case-1024',
    'The Locked Room Murder',
    'Victim John Harrison, age 45, was found dead in his home office at 11:30 PM on March 15, 2024. The room was locked from the inside. Cause of death: stab wound from a kitchen knife. Three people were present in the house that evening: Alice Morgan (business partner), Bob Chen (neighbor and friend), and Charlie Davis (personal assistant). The front door CCTV shows someone entering at 10:42 PM. No signs of forced entry.',
    'CREATED',
    'CASE_CREATED',
    0.0
);

-- -----------------------------------------------------------
-- PERSONS
-- -----------------------------------------------------------
INSERT INTO PERSONS (person_id, case_id, name, age, occupation, role, relationship, description)
VALUES ('person-victim', 'case-1024', 'John Harrison', 45, 'CEO, Harrison Tech', 'VICTIM', 'N/A', 'Successful tech entrepreneur. Recently involved in a contentious business deal. Found dead in locked home office.');

INSERT INTO PERSONS (person_id, case_id, name, age, occupation, role, relationship, description)
VALUES ('person-alice', 'case-1024', 'Alice Morgan', 38, 'COO, Harrison Tech', 'SUSPECT', 'Business partner for 8 years', 'Co-founded the company with the victim. Recently had disagreements about selling the company. Stands to gain full control if victim dies. Was at the house for a business dinner.');

INSERT INTO PERSONS (person_id, case_id, name, age, occupation, role, relationship, description)
VALUES ('person-bob', 'case-1024', 'Bob Chen', 52, 'Retired Engineer', 'SUSPECT', 'Neighbor and close friend for 15 years', 'Lives next door. Close friend of the victim. Was invited for dinner. Claims he left at 10:00 PM. Known to have borrowed money from victim.');

INSERT INTO PERSONS (person_id, case_id, name, age, occupation, role, relationship, description)
VALUES ('person-charlie', 'case-1024', 'Charlie Davis', 28, 'Personal Assistant', 'SUSPECT', 'Employee for 3 years', 'Personal assistant who manages victim schedule and household. Was in the house doing cleanup after dinner. Has access to all rooms including the office.');

-- -----------------------------------------------------------
-- EVIDENCE
-- -----------------------------------------------------------
INSERT INTO EVIDENCE (evidence_id, case_id, type, name, description, location, discovered_at, origin, reliability)
VALUES ('ev-knife', 'case-1024', 'PHYSICAL', 'Kitchen Knife', 'Standard 8-inch kitchen knife from the victim house kitchen set. Found embedded in victim chest. One knife missing from the kitchen knife block.', 'Home Office', TIMESTAMP '2024-03-15 23:35:00', 'Crime Scene Unit', 0.95);

INSERT INTO EVIDENCE (evidence_id, case_id, type, name, description, location, discovered_at, origin, reliability)
VALUES ('ev-cctv', 'case-1024', 'DIGITAL', 'Front Door CCTV', 'Security camera footage showing a person entering through the front door at 10:42 PM. The person is wearing a dark hoodie. Face partially obscured. Build is consistent with either Alice or Charlie.', 'Front Door', TIMESTAMP '2024-03-15 22:42:00', 'Home Security System', 0.90);

INSERT INTO EVIDENCE (evidence_id, case_id, type, name, description, location, discovered_at, origin, reliability)
VALUES ('ev-fingerprint', 'case-1024', 'FORENSIC', 'Fingerprints on Knife', 'Fingerprint analysis of the murder weapon. Partial prints found matching Alice Morgan. However, as a dinner guest who helped in the kitchen, her prints on kitchen items may be innocent.', 'Home Office / Knife', TIMESTAMP '2024-03-16 09:00:00', 'Forensics Lab', 0.91);

INSERT INTO EVIDENCE (evidence_id, case_id, type, name, description, location, discovered_at, origin, reliability)
VALUES ('ev-phone', 'case-1024', 'DIGITAL', 'Phone Records', 'Victim phone shows last activity at 10:55 PM — an unsent text message draft to Alice reading: "We need to talk about what you did. I know everything." Phone found on desk.', 'Home Office', TIMESTAMP '2024-03-16 10:00:00', 'Digital Forensics', 0.95);

INSERT INTO EVIDENCE (evidence_id, case_id, type, name, description, location, discovered_at, origin, reliability)
VALUES ('ev-lock', 'case-1024', 'PHYSICAL', 'Door Lock Mechanism', 'Office door was locked from the inside using a twist deadbolt. No key required from inside. Window was closed but not locked. Window is on ground floor facing the backyard.', 'Home Office Door', TIMESTAMP '2024-03-15 23:30:00', 'First Responders', 0.98);

-- -----------------------------------------------------------
-- LOCATIONS
-- -----------------------------------------------------------
INSERT INTO LOCATIONS (location_id, case_id, name, type, description, relevance)
VALUES ('loc-house', 'case-1024', 'Harrison Residence', 'CRIME_SCENE', 'Large two-story house at 42 Oak Lane. Scene of the murder.', 'Primary crime scene. All suspects were present here during the evening.');

INSERT INTO LOCATIONS (location_id, case_id, name, type, description, relevance)
VALUES ('loc-office', 'case-1024', 'Home Office', 'CRIME_SCENE', 'Ground floor office where victim was found. Locked from inside. Has one window facing backyard.', 'Room where victim was found dead. Locked room puzzle.');

INSERT INTO LOCATIONS (location_id, case_id, name, type, description, relevance)
VALUES ('loc-kitchen', 'case-1024', 'Kitchen', 'CRIME_SCENE', 'Large open kitchen where dinner was prepared. Knife block with one missing knife.', 'Source of murder weapon. All three suspects had access during dinner.');

INSERT INTO LOCATIONS (location_id, case_id, name, type, description, relevance)
VALUES ('loc-frontdoor', 'case-1024', 'Front Door', 'CRIME_SCENE', 'Main entrance with CCTV camera. Only monitored entry point.', 'CCTV captured someone entering at 10:42 PM.');

-- -----------------------------------------------------------
-- EVENTS (Timeline)
-- -----------------------------------------------------------
INSERT INTO EVENTS (event_id, case_id, event_time, description, location_id, origin, verified, confidence)
VALUES ('evt-1', 'case-1024', TIMESTAMP '2024-03-15 18:30:00', 'Dinner begins. All four people present: John, Alice, Bob, Charlie.', 'loc-kitchen', 'All statements agree', TRUE, 0.95);

INSERT INTO EVENTS (event_id, case_id, event_time, description, location_id, origin, verified, confidence)
VALUES ('evt-2', 'case-1024', TIMESTAMP '2024-03-15 21:00:00', 'Dinner concludes. Group moves to living room for drinks.', 'loc-house', 'All statements agree', TRUE, 0.90);

INSERT INTO EVENTS (event_id, case_id, event_time, description, location_id, origin, verified, confidence)
VALUES ('evt-3', 'case-1024', TIMESTAMP '2024-03-15 22:00:00', 'Bob claims he left the house and went home next door.', 'loc-frontdoor', 'Bob statement only', FALSE, 0.50);

INSERT INTO EVENTS (event_id, case_id, event_time, description, location_id, origin, verified, confidence)
VALUES ('evt-4', 'case-1024', TIMESTAMP '2024-03-15 22:42:00', 'CCTV shows person in dark hoodie entering front door.', 'loc-frontdoor', 'CCTV Camera', TRUE, 0.90);

INSERT INTO EVENTS (event_id, case_id, event_time, description, location_id, origin, verified, confidence)
VALUES ('evt-5', 'case-1024', TIMESTAMP '2024-03-15 22:55:00', 'Victim phone shows last activity — unsent text to Alice.', 'loc-office', 'Digital Forensics', TRUE, 0.95);

INSERT INTO EVENTS (event_id, case_id, event_time, description, location_id, origin, verified, confidence)
VALUES ('evt-6', 'case-1024', TIMESTAMP '2024-03-15 23:30:00', 'Charlie discovers the locked office door. Calls 911.', 'loc-office', 'Charlie statement + 911 records', TRUE, 0.95);

-- -----------------------------------------------------------
-- STATEMENTS
-- -----------------------------------------------------------
INSERT INTO STATEMENTS (statement_id, case_id, person_id, content, timestamp_ref, confidence)
VALUES ('stmt-alice-1', 'case-1024', 'person-alice', 'I left the house around 10:15 PM. John said he had some work to finish in his office. I drove straight home. I was home by 10:30 PM.', TIMESTAMP '2024-03-15 22:15:00', 0.60);

INSERT INTO STATEMENTS (statement_id, case_id, person_id, content, timestamp_ref, confidence)
VALUES ('stmt-bob-1', 'case-1024', 'person-bob', 'I left at around 10:00 PM. I walked home next door. I watched TV until midnight and then went to bed. I did not go back to John house that night.', TIMESTAMP '2024-03-15 22:00:00', 0.50);

INSERT INTO STATEMENTS (statement_id, case_id, person_id, content, timestamp_ref, confidence)
VALUES ('stmt-charlie-1', 'case-1024', 'person-charlie', 'After everyone left, I was cleaning up in the kitchen. Around 11:30 PM I went to check on Mr. Harrison and found the office door locked. I knocked several times with no answer, so I called 911.', TIMESTAMP '2024-03-15 23:30:00', 0.70);
