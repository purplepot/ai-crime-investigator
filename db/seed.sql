-- ============================================================
-- SEED DATA — Multi-Case Forensic Database
-- ============================================================
-- Case #1024: The Locked Room Murder
-- Case #1025: The Poisoned Gala
-- Case #1026: The Midnight Pier Mystery
-- ============================================================

OPEN SCHEMA INVESTIGATION;

-- ============================================================
-- CASE 1: The Locked Room Murder (Case #1024)
-- ============================================================

INSERT INTO INVESTIGATION.CASES (case_id, title, description, status, current_stage, confidence)
VALUES (
    'case-1024',
    'The Locked Room Murder',
    'Victim John Harrison, age 45, was found dead in his home office at 11:30 PM on March 15, 2024. The room was locked from the inside. Cause of death: stab wound from a kitchen knife. Three people were present in the house that evening: Alice Morgan (business partner), Bob Chen (neighbor and friend), and Charlie Davis (personal assistant). The front door CCTV shows someone entering at 10:42 PM. No signs of forced entry.',
    'CREATED',
    'CASE_CREATED',
    0.0
);

INSERT INTO PERSONS (person_id, case_id, name, age, occupation, role, relationship, description)
VALUES ('person-victim-1024', 'case-1024', 'John Harrison', 45, 'CEO, Harrison Tech', 'VICTIM', 'N/A', 'Successful tech entrepreneur. Recently involved in a contentious business deal. Found dead in locked home office.');

INSERT INTO PERSONS (person_id, case_id, name, age, occupation, role, relationship, description)
VALUES ('person-alice', 'case-1024', 'Alice Morgan', 38, 'COO, Harrison Tech', 'SUSPECT', 'Business partner for 8 years', 'Co-founded the company with the victim. Recently had disagreements about selling the company. Stands to gain full control if victim dies. Was at the house for a business dinner.');

INSERT INTO PERSONS (person_id, case_id, name, age, occupation, role, relationship, description)
VALUES ('person-bob', 'case-1024', 'Bob Chen', 52, 'Retired Engineer', 'SUSPECT', 'Neighbor and close friend for 15 years', 'Lives next door. Close friend of the victim. Was invited for dinner. Claims he left at 10:00 PM. Known to have borrowed money from victim.');

INSERT INTO PERSONS (person_id, case_id, name, age, occupation, role, relationship, description)
VALUES ('person-charlie', 'case-1024', 'Charlie Davis', 28, 'Personal Assistant', 'SUSPECT', 'Employee for 3 years', 'Personal assistant who manages victim schedule and household. Was in the house doing cleanup after dinner. Has access to all rooms including the office.');

INSERT INTO EVIDENCE (evidence_id, case_id, type, name, description, location, discovered_at, origin, reliability)
VALUES ('ev-knife-1024', 'case-1024', 'PHYSICAL', 'Kitchen Knife', 'Standard 8-inch kitchen knife from the victim house kitchen set. Found embedded in victim chest. One knife missing from the kitchen knife block.', 'Home Office', TIMESTAMP '2024-03-15 23:35:00', 'Crime Scene Unit', 0.95);

INSERT INTO EVIDENCE (evidence_id, case_id, type, name, description, location, discovered_at, origin, reliability)
VALUES ('ev-cctv-1024', 'case-1024', 'DIGITAL', 'Front Door CCTV', 'Security camera footage showing a person entering through the front door at 10:42 PM. The person is wearing a dark hoodie. Face partially obscured. Build is consistent with either Alice or Charlie.', 'Front Door', TIMESTAMP '2024-03-15 22:42:00', 'Home Security System', 0.90);

INSERT INTO EVIDENCE (evidence_id, case_id, type, name, description, location, discovered_at, origin, reliability)
VALUES ('ev-fingerprint-1024', 'case-1024', 'FORENSIC', 'Fingerprints on Knife', 'Fingerprint analysis of the murder weapon. Partial prints found matching Alice Morgan. However, as a dinner guest who helped in the kitchen, her prints on kitchen items may be innocent.', 'Home Office / Knife', TIMESTAMP '2024-03-16 09:00:00', 'Forensics Lab', 0.91);

INSERT INTO EVIDENCE (evidence_id, case_id, type, name, description, location, discovered_at, origin, reliability)
VALUES ('ev-phone-1024', 'case-1024', 'DIGITAL', 'Phone Records', 'Victim phone shows last activity at 10:55 PM — an unsent text message draft to Alice reading: "We need to talk about what you did. I know everything." Phone found on desk.', 'Home Office', TIMESTAMP '2024-03-16 10:00:00', 'Digital Forensics', 0.95);

INSERT INTO EVIDENCE (evidence_id, case_id, type, name, description, location, discovered_at, origin, reliability)
VALUES ('ev-lock-1024', 'case-1024', 'PHYSICAL', 'Door Lock Mechanism', 'Office door was locked from the inside using a twist deadbolt. No key required from inside. Window was closed but not locked. Window is on ground floor facing the backyard.', 'Home Office Door', TIMESTAMP '2024-03-15 23:30:00', 'First Responders', 0.98);

INSERT INTO LOCATIONS (location_id, case_id, name, type, description, relevance)
VALUES ('loc-house-1024', 'case-1024', 'Harrison Residence', 'CRIME_SCENE', 'Large two-story house at 42 Oak Lane. Scene of the murder.', 'Primary crime scene. All suspects were present here during the evening.');

INSERT INTO LOCATIONS (location_id, case_id, name, type, description, relevance)
VALUES ('loc-office-1024', 'case-1024', 'Home Office', 'CRIME_SCENE', 'Ground floor office where victim was found. Locked from inside. Has one window facing backyard.', 'Room where victim was found dead. Locked room puzzle.');

INSERT INTO LOCATIONS (location_id, case_id, name, type, description, relevance)
VALUES ('loc-kitchen-1024', 'case-1024', 'Kitchen', 'CRIME_SCENE', 'Large open kitchen where dinner was prepared. Knife block with one missing knife.', 'Source of murder weapon. All three suspects had access during dinner.');

INSERT INTO LOCATIONS (location_id, case_id, name, type, description, relevance)
VALUES ('loc-frontdoor-1024', 'case-1024', 'Front Door', 'CRIME_SCENE', 'Main entrance with CCTV camera. Only monitored entry point.', 'CCTV captured someone entering at 10:42 PM.');

INSERT INTO EVENTS (event_id, case_id, event_time, description, location_id, origin, verified, confidence)
VALUES ('evt-1-1024', 'case-1024', TIMESTAMP '2024-03-15 18:30:00', 'Dinner begins. All four people present: John, Alice, Bob, Charlie.', 'loc-kitchen-1024', 'All statements agree', TRUE, 0.95);

INSERT INTO EVENTS (event_id, case_id, event_time, description, location_id, origin, verified, confidence)
VALUES ('evt-2-1024', 'case-1024', TIMESTAMP '2024-03-15 21:00:00', 'Dinner concludes. Group moves to living room for drinks.', 'loc-house-1024', 'All statements agree', TRUE, 0.90);

INSERT INTO EVENTS (event_id, case_id, event_time, description, location_id, origin, verified, confidence)
VALUES ('evt-3-1024', 'case-1024', TIMESTAMP '2024-03-15 22:00:00', 'Bob claims he left the house and went home next door.', 'loc-frontdoor-1024', 'Bob statement only', FALSE, 0.50);

INSERT INTO EVENTS (event_id, case_id, event_time, description, location_id, origin, verified, confidence)
VALUES ('evt-4-1024', 'case-1024', TIMESTAMP '2024-03-15 22:42:00', 'CCTV shows person in dark hoodie entering front door.', 'loc-frontdoor-1024', 'CCTV Camera', TRUE, 0.90);

INSERT INTO EVENTS (event_id, case_id, event_time, description, location_id, origin, verified, confidence)
VALUES ('evt-5-1024', 'case-1024', TIMESTAMP '2024-03-15 22:55:00', 'Victim phone shows last activity — unsent text to Alice.', 'loc-office-1024', 'Digital Forensics', TRUE, 0.95);

INSERT INTO EVENTS (event_id, case_id, event_time, description, location_id, origin, verified, confidence)
VALUES ('evt-6-1024', 'case-1024', TIMESTAMP '2024-03-15 23:30:00', 'Charlie discovers the locked office door. Calls 911.', 'loc-office-1024', 'Charlie statement + 911 records', TRUE, 0.95);

INSERT INTO STATEMENTS (statement_id, case_id, person_id, content, timestamp_ref, confidence)
VALUES ('stmt-alice-1', 'case-1024', 'person-alice', 'I left the house around 10:15 PM. John said he had some work to finish in his office. I drove straight home. I was home by 10:30 PM.', TIMESTAMP '2024-03-15 22:15:00', 0.60);

INSERT INTO STATEMENTS (statement_id, case_id, person_id, content, timestamp_ref, confidence)
VALUES ('stmt-bob-1', 'case-1024', 'person-bob', 'I left at around 10:00 PM. I walked home next door. I watched TV until midnight and then went to bed. I did not go back to John house that night.', TIMESTAMP '2024-03-15 22:00:00', 0.50);

INSERT INTO STATEMENTS (statement_id, case_id, person_id, content, timestamp_ref, confidence)
VALUES ('stmt-charlie-1', 'case-1024', 'person-charlie', 'After everyone left, I was cleaning up in the kitchen. Around 11:30 PM I went to check on Mr. Harrison and found the office door locked. I knocked several times with no answer, so I called 911.', TIMESTAMP '2024-03-15 23:30:00', 0.70);


-- ============================================================
-- CASE 2: The Poisoned Gala (Case #1025)
-- ============================================================

INSERT INTO INVESTIGATION.CASES (case_id, title, description, status, current_stage, confidence)
VALUES (
    'case-1025',
    'The Poisoned Gala',
    'Dr. Arthur Pendelton, age 58, renowned toxicologist and pharmaceutical heir, collapsed and died during his foundation annual gala at the Grand Horizon Hotel at 9:45 PM. Autopsy confirmed acute potassium cyanide poisoning ingested via a vintage champagne toast. Three people had direct access to the private VIP bar: Elena Rostova (research partner in a fierce patent dispute), Marcus Vance (estranged stepson drowning in gambling debts and sole $10M trust heir), and Sarah Lin (the private sommelier hired for the evening whose credentials turned out to be forged).',
    'CREATED',
    'CASE_CREATED',
    0.0
);

INSERT INTO PERSONS (person_id, case_id, name, age, occupation, role, relationship, description)
VALUES ('person-victim-1025', 'case-1025', 'Dr. Arthur Pendelton', 58, 'Founder & Chief Toxicologist', 'VICTIM', 'N/A', 'Philanthropist and wealthy pharmaceutical patent holder. Collapsed mid-speech after a private champagne toast.');

INSERT INTO PERSONS (person_id, case_id, name, age, occupation, role, relationship, description)
VALUES ('person-elena', 'case-1025', 'Elena Rostova', 44, 'Senior Biochemist', 'SUSPECT', 'Research Partner for 12 years', 'Co-developed Arthur flagship drug. Alleged Arthur secretly licensed her formula without royalty rights. Was seen in a heated argument with Arthur before the toast.');

INSERT INTO PERSONS (person_id, case_id, name, age, occupation, role, relationship, description)
VALUES ('person-marcus', 'case-1025', 'Marcus Vance', 29, 'Venture Capitalist', 'SUSPECT', 'Stepson / Sole Heir', 'Faced violent collection threats over $2.4M in high-stakes casino debts. Receives immediate control of a $10M family trust upon Arthur demise.');

INSERT INTO PERSONS (person_id, case_id, name, age, occupation, role, relationship, description)
VALUES ('person-sarah', 'case-1025', 'Sarah Lin', 31, 'Private Sommelier', 'SUSPECT', 'Hired Contractor', 'Responsible for uncorking and serving the private reserve champagne flutes. Investigators discovered her catering license belonged to a deceased sommelier.');

INSERT INTO EVIDENCE (evidence_id, case_id, type, name, description, location, discovered_at, origin, reliability)
VALUES ('ev-glass-1025', 'case-1025', 'PHYSICAL', 'Cyanide-Coated Champagne Flute', 'Crystal champagne flute used by Dr. Pendelton. Micro-swabs detected concentrated potassium cyanide powder coated along the interior rim.', 'VIP Bar / Table 1', TIMESTAMP '2024-04-02 22:10:00', 'Crime Scene Forensics', 0.98);

INSERT INTO EVIDENCE (evidence_id, case_id, type, name, description, location, discovered_at, origin, reliability)
VALUES ('ev-vial-1025', 'case-1025', 'PHYSICAL', 'Amber Glass Dropper Vial', 'Small 15ml chemical dropper vial discarded in the VIP lounge restroom bin. Traces of cyanide residue confirmed by lab mass spectrometer.', 'VIP Restroom', TIMESTAMP '2024-04-02 22:30:00', 'Hazmat Unit', 0.94);

INSERT INTO EVIDENCE (evidence_id, case_id, type, name, description, location, discovered_at, origin, reliability)
VALUES ('ev-patent-1025', 'case-1025', 'DOCUMENT', 'Torn Settlement Draft', 'Confidential draft agreement regarding patent royalties found in Elena Rostova handbag, torn in half with Arthur handwritten note: "Not a penny more."', 'Coat Check Area', TIMESTAMP '2024-04-02 23:00:00', 'Investigative Unit', 0.90);

INSERT INTO EVIDENCE (evidence_id, case_id, type, name, description, location, discovered_at, origin, reliability)
VALUES ('ev-texts-1025', 'case-1025', 'DIGITAL', 'Marcus Debt Messages', 'Marcus phone reveals encrypted messages from loan sharks demanding repayment by midnight on April 2nd or facing severe physical retaliation.', 'Marcus Vance Phone', TIMESTAMP '2024-04-03 01:15:00', 'Cyber Crime Division', 0.96);

INSERT INTO EVIDENCE (evidence_id, case_id, type, name, description, location, discovered_at, origin, reliability)
VALUES ('ev-id-1025', 'case-1025', 'DOCUMENT', 'Forged Hospitality Credentials', 'Staff locker search revealed Sarah Lin real identity as a former lab technician previously terminated from Arthur pharmaceutical facility 5 years ago.', 'Staff Locker 14', TIMESTAMP '2024-04-03 02:00:00', 'Police Department', 0.92);

INSERT INTO LOCATIONS (location_id, case_id, name, type, description, relevance)
VALUES ('loc-ballroom-1025', 'case-1025', 'Grand Ballroom', 'EVENT_VENUE', 'Main ballroom at Grand Horizon Hotel where 200 gala attendees gathered.', 'Scene where Arthur delivered his toast and collapsed.');

INSERT INTO LOCATIONS (location_id, case_id, name, type, description, relevance)
VALUES ('loc-vipbar-1025', 'case-1025', 'VIP Lounge Bar', 'CRIME_SCENE', 'Private partitioned bar with security access reserved exclusively for Arthur and key donors.', 'Where the four champagne flutes were poured and staged.');

INSERT INTO LOCATIONS (location_id, case_id, name, type, description, relevance)
VALUES ('loc-viprestroom-1025', 'case-1025', 'VIP Restroom', 'CRIME_SCENE', 'Restroom located directly adjacent to VIP Bar.', 'Location where the empty cyanide vial was discarded.');

INSERT INTO EVENTS (event_id, case_id, event_time, description, location_id, origin, verified, confidence)
VALUES ('evt-1-1025', 'case-1025', TIMESTAMP '2024-04-02 19:30:00', 'Charity gala begins in Grand Ballroom. All guests arrive.', 'loc-ballroom-1025', 'Event Logistics Log', TRUE, 0.95);

INSERT INTO EVENTS (event_id, case_id, event_time, description, location_id, origin, verified, confidence)
VALUES ('evt-2-1025', 'case-1025', TIMESTAMP '2024-04-02 20:45:00', 'Arthur, Elena, and Marcus retreat to private VIP Lounge Bar.', 'loc-vipbar-1025', 'VIP Security Log', TRUE, 0.90);

INSERT INTO EVENTS (event_id, case_id, event_time, description, location_id, origin, verified, confidence)
VALUES ('evt-3-1025', 'case-1025', TIMESTAMP '2024-04-02 21:15:00', 'Sarah Lin opens bottle of vintage champagne and pours four flutes on silver tray.', 'loc-vipbar-1025', 'Bar Staff Witness', TRUE, 0.88);

INSERT INTO EVENTS (event_id, case_id, event_time, description, location_id, origin, verified, confidence)
VALUES ('evt-4-1025', 'case-1025', TIMESTAMP '2024-04-02 21:30:00', 'Elena and Arthur have loud argument over contract; Elena storms out toward restroom.', 'loc-vipbar-1025', 'VIP Guests Statement', TRUE, 0.85);

INSERT INTO EVENTS (event_id, case_id, event_time, description, location_id, origin, verified, confidence)
VALUES ('evt-5-1025', 'case-1025', TIMESTAMP '2024-04-02 21:40:00', 'Marcus picks up silver tray and hands specific champagne flute to Arthur.', 'loc-ballroom-1025', 'Ballroom Video Recording', TRUE, 0.95);

INSERT INTO EVENTS (event_id, case_id, event_time, description, location_id, origin, verified, confidence)
VALUES ('evt-6-1025', 'case-1025', TIMESTAMP '2024-04-02 21:45:00', 'Arthur takes drink during toast, chokes, and collapses on stage. Emergency 911 called.', 'loc-ballroom-1025', 'Hospital Emergency Records', TRUE, 0.98);

INSERT INTO STATEMENTS (statement_id, case_id, person_id, content, timestamp_ref, confidence)
VALUES ('stmt-elena-1', 'case-1025', 'person-elena', 'Arthur was ruthless in business, but I did not kill him. I walked to the garden terrace at 21:35 to make a phone call to my attorney.', TIMESTAMP '2024-04-02 21:35:00', 0.65);

INSERT INTO STATEMENTS (statement_id, case_id, person_id, content, timestamp_ref, confidence)
VALUES ('stmt-marcus-1', 'case-1025', 'person-marcus', 'I simply carried the tray over to my stepfather as a gesture of respect before his speech. I picked up whichever glass was closest to him.', TIMESTAMP '2024-04-02 21:40:00', 0.55);

INSERT INTO STATEMENTS (statement_id, case_id, person_id, content, timestamp_ref, confidence)
VALUES ('stmt-sarah-1', 'case-1025', 'person-sarah', 'I prepared all glasses simultaneously from a single sealed bottle. Both Marcus and Elena were hovering around the bar while I was arranging the napkins.', TIMESTAMP '2024-04-02 21:15:00', 0.70);


-- ============================================================
-- CASE 3: The Midnight Pier Mystery (Case #1026)
-- ============================================================

INSERT INTO INVESTIGATION.CASES (case_id, title, description, status, current_stage, confidence)
VALUES (
    'case-1026',
    'The Midnight Pier Mystery',
    'Harbor master and shipping magnate Gregory Vance, age 62, was discovered dead at 2:00 AM in the harbor basin alongside Pier 14. Autopsy established cause of death as blunt force trauma to the occipital skull followed by seawater drowning. His locked briefcase containing unreleased container manifests and offshore customs audit reports was found discarded with files missing. Three individuals were logged entering the restricted dock gate between midnight and 1:30 AM: Captain Derek Ross (freighter captain under federal smuggling probe), Maya Sterling (port authority auditor with evidence of Gregory graft), and Viktor Cruz (shift foreman caught forging cargo weight certificates).',
    'CREATED',
    'CASE_CREATED',
    0.0
);

INSERT INTO PERSONS (person_id, case_id, name, age, occupation, role, relationship, description)
VALUES ('person-victim-1026', 'case-1026', 'Gregory Vance', 62, 'Chief Harbor Master & Terminal Director', 'VICTIM', 'N/A', 'Powerful port administrator controlling commercial shipping berths. Found dead submerged beside Pier 14.');

INSERT INTO PERSONS (person_id, case_id, name, age, occupation, role, relationship, description)
VALUES ('person-derek', 'case-1026', 'Capt. Derek Ross', 49, 'Commercial Cargo Captain', 'SUSPECT', 'Contracted Carrier', 'Under imminent threat of losing maritime master license after Gregory threatened to hand over vessel inspection records to federal prosecutors.');

INSERT INTO PERSONS (person_id, case_id, name, age, occupation, role, relationship, description)
VALUES ('person-maya', 'case-1026', 'Maya Sterling', 36, 'Senior Customs Auditor', 'SUSPECT', 'Federal Port Inspector', 'Had been investigating terminal kickbacks. Was scheduled to confront Gregory that night with an ultimatum to surrender the physical shipping manifests.');

INSERT INTO PERSONS (person_id, case_id, name, age, occupation, role, relationship, description)
VALUES ('person-viktor', 'case-1026', 'Viktor Cruz', 41, 'Dock Shift Supervisor', 'SUSPECT', 'Direct Subordinate', 'Gregory discovered Viktor was accepting illegal cash bribes to falsify container gross weight tickets, and had promised to fire him that night.');

INSERT INTO EVIDENCE (evidence_id, case_id, type, name, description, location, discovered_at, origin, reliability)
VALUES ('ev-wrench-1026', 'case-1026', 'PHYSICAL', 'Heavy Bronze Mooring Wrench', 'Industrial 18-inch bronze wrench retrieved from shallow harbor floor beneath Pier 14. Forensic blood typing matches Gregory Vance blood group.', 'Harbor Basin / Pier 14', TIMESTAMP '2024-05-10 03:30:00', 'Police Harbor Dive Unit', 0.96);

INSERT INTO EVIDENCE (evidence_id, case_id, type, name, description, location, discovered_at, origin, reliability)
VALUES ('ev-rfid-1026', 'case-1026', 'DIGITAL', 'Gate 4 Access Telemetry', 'Electronic security gate logs registering keycard access into the restricted Pier 14 zone: Maya at 00:35, Viktor at 00:50, Derek at 01:05.', 'Port Security Server', TIMESTAMP '2024-05-10 04:00:00', 'Port Authority IT', 0.98);

INSERT INTO EVIDENCE (evidence_id, case_id, type, name, description, location, discovered_at, origin, reliability)
VALUES ('ev-briefcase-1026', 'case-1026', 'PHYSICAL', 'Damaged Leather Briefcase', 'Gregory briefcase found floating near Pier 12 slipway. Combination lock forced open with chisel; container manifest logs for vessel Sea Sovereign ripped out.', 'Pier 12 Slipway', TIMESTAMP '2024-05-10 05:15:00', 'Coast Guard Patrol', 0.92);

INSERT INTO EVIDENCE (evidence_id, case_id, type, name, description, location, discovered_at, origin, reliability)
VALUES ('ev-camera-1026', 'case-1026', 'DIGITAL', 'Thermal Dock Camera Recording', 'Infrared security footage at 01:12 AM displaying two thermal figures in physical struggle on edge of Pier 14 followed by splash in basin.', 'Pier 14 Masthead Camera', TIMESTAMP '2024-05-10 06:00:00', 'Port Surveillance', 0.90);

INSERT INTO EVIDENCE (evidence_id, case_id, type, name, description, location, discovered_at, origin, reliability)
VALUES ('ev-mudboots-1026', 'case-1026', 'FORENSIC', 'Grease & Silt Footwear Impressions', 'Fresh heavy lug boot impressions on Pier 14 edge matching specialized grease-resistant work boots recovered from Viktor Cruz truck locker.', 'Pier 14 Bollard 3', TIMESTAMP '2024-05-10 07:00:00', 'Forensic Identification Unit', 0.94);

INSERT INTO LOCATIONS (location_id, case_id, name, type, description, relevance)
VALUES ('loc-pier14-1026', 'case-1026', 'Pier 14 Commercial Berth', 'CRIME_SCENE', 'Deepwater cargo pier equipped with container cranes and tie-up bollards.', 'Primary murder scene and harbor splash point.');

INSERT INTO LOCATIONS (location_id, case_id, name, type, description, relevance)
VALUES ('loc-gate4-1026', 'case-1026', 'Security Gate 4 Checkpoint', 'SECURITY_CHECKPOINT', 'Automated RFID card access gate enclosing the north container berths.', 'Only road entry point recorded for the suspects.');

INSERT INTO LOCATIONS (location_id, case_id, name, type, description, relevance)
VALUES ('loc-harboroffice-1026', 'case-1026', 'Harbor Master Office', 'OFFICE_BUILDING', 'Two-story operations building overlooking Pier 14.', 'Where Gregory was working before walking to Pier 14.');

INSERT INTO EVENTS (event_id, case_id, event_time, description, location_id, origin, verified, confidence)
VALUES ('evt-1-1026', 'case-1026', TIMESTAMP '2024-05-10 00:15:00', 'Gregory Vance arrives at Harbor Master Office for unscheduled late shift audit.', 'loc-harboroffice-1026', 'Office Entry Keypad', TRUE, 0.95);

INSERT INTO EVENTS (event_id, case_id, event_time, description, location_id, origin, verified, confidence)
VALUES ('evt-2-1026', 'case-1026', TIMESTAMP '2024-05-10 00:35:00', 'Maya Sterling scans badge at Gate 4 and drives toward administrative office.', 'loc-gate4-1026', 'Gate 4 Telemetry', TRUE, 0.98);

INSERT INTO EVENTS (event_id, case_id, event_time, description, location_id, origin, verified, confidence)
VALUES ('evt-3-1026', 'case-1026', TIMESTAMP '2024-05-10 00:50:00', 'Viktor Cruz scans badge at Gate 4 entering the cargo terminal.', 'loc-gate4-1026', 'Gate 4 Telemetry', TRUE, 0.98);

INSERT INTO EVENTS (event_id, case_id, event_time, description, location_id, origin, verified, confidence)
VALUES ('evt-4-1026', 'case-1026', TIMESTAMP '2024-05-10 01:05:00', 'Capt. Derek Ross badge scans at Gate 4; observed on CCTV walking towards Pier 14.', 'loc-pier14-1026', 'Gate 4 + Camera 8', TRUE, 0.92);

INSERT INTO EVENTS (event_id, case_id, event_time, description, location_id, origin, verified, confidence)
VALUES ('evt-5-1026', 'case-1026', TIMESTAMP '2024-05-10 01:12:00', 'Thermal camera captures struggle on Pier 14 edge and body entering harbor basin.', 'loc-pier14-1026', 'Thermal Surveillance', TRUE, 0.94);

INSERT INTO EVENTS (event_id, case_id, event_time, description, location_id, origin, verified, confidence)
VALUES ('evt-6-1026', 'case-1026', TIMESTAMP '2024-05-10 02:00:00', 'Night watchman spots Gregory floating beside Pier 14 bollard. 911 summoned.', 'loc-pier14-1026', 'Police Dispatch Incident Log', TRUE, 0.98);

INSERT INTO STATEMENTS (statement_id, case_id, person_id, content, timestamp_ref, confidence)
VALUES ('stmt-derek-1', 'case-1026', 'person-derek', 'I arrived at 1:05 AM solely to inspect my ship tie-off lines due to the rising tide. I never spoke to Gregory and saw no one on Pier 14.', TIMESTAMP '2024-05-10 01:05:00', 0.55);

INSERT INTO STATEMENTS (statement_id, case_id, person_id, content, timestamp_ref, confidence)
VALUES ('stmt-maya-1', 'case-1026', 'person-maya', 'I met Gregory in his second-floor office at 00:40. We reviewed manifest discrepancies. I concluded our meeting at 01:00 and drove straight off the port.', TIMESTAMP '2024-05-10 00:40:00', 0.70);

INSERT INTO STATEMENTS (statement_id, case_id, person_id, content, timestamp_ref, confidence)
VALUES ('stmt-viktor-1', 'case-1026', 'person-viktor', 'I was in Warehouse 3 managing crane maintenance logs from 1:00 AM to 2:30 AM. My boots get harbor silt on them every single workday.', TIMESTAMP '2024-05-10 01:00:00', 0.60);


-- ============================================================
-- CASE ROSTER — Per-case investigation team characters
-- ============================================================

-- Case #1024: The Locked Room Murder
INSERT INTO CASE_ROSTER (roster_id, case_id, agent_key, display_name, role_type, persona, initials, color, icon, sequence_order)
VALUES ('r-1024-1', 'case-1024', 'officer_davis', 'Patrol Officer Davis', 'COORDINATOR', 'First responder who breached the locked office door. 12 years on the force with sharp street-level instincts. Directs the team and coordinates all investigative leads with military precision.', 'PD', 'blue', 'shield', 1);

INSERT INTO CASE_ROSTER (roster_id, case_id, agent_key, display_name, role_type, persona, initials, color, icon, sequence_order)
VALUES ('r-1024-2', 'case-1024', 'forensics_sterling', 'Forensics Lead Sterling', 'FORENSICS', 'Senior crime scene technician with 18 years specializing in fingerprint analysis, blood spatter patterns, and digital device forensics. Meticulous and detail-oriented.', 'FS', 'cyan', 'microscope', 2);

INSERT INTO CASE_ROSTER (roster_id, case_id, agent_key, display_name, role_type, persona, initials, color, icon, sequence_order)
VALUES ('r-1024-3', 'case-1024', 'locksmith_jenkins', 'Master Locksmith Jenkins', 'SPECIALIST', 'Certified master locksmith and physical security expert with 25 years experience. Analyzes the deadbolt mechanism, window lock status, and determines how the killer could have locked the room from outside.', 'LJ', 'amber', 'key', 3);

INSERT INTO CASE_ROSTER (roster_id, case_id, agent_key, display_name, role_type, persona, initials, color, icon, sequence_order)
VALUES ('r-1024-4', 'case-1024', 'claire_harrison', 'Claire Harrison', 'WITNESS_ANALYST', 'The victim sister and closest confidante. Provides deeply personal context about family disputes, John contentious business deal with Alice, recent paranoid text messages, and Charlie growing resentment over salary disputes.', 'CH', 'rose', 'user', 4);

INSERT INTO CASE_ROSTER (roster_id, case_id, agent_key, display_name, role_type, persona, initials, color, icon, sequence_order)
VALUES ('r-1024-5', 'case-1024', 'det_reynolds', 'Det. Reynolds', 'INTERROGATOR', 'Veteran homicide interrogator with 20 years experience breaking alibis. Known for his calm, methodical questioning style that catches suspects in contradictions before they realize it.', 'DR', 'emerald', 'mic', 5);

INSERT INTO CASE_ROSTER (roster_id, case_id, agent_key, display_name, role_type, persona, initials, color, icon, sequence_order)
VALUES ('r-1024-6', 'case-1024', 'ada_shaw', 'ADA Kathleen Shaw', 'LEGAL_REVIEW', 'Assistant District Attorney with a 94 percent conviction rate. Evaluates whether the evidence meets the threshold for filing charges and identifies weaknesses a defense attorney would exploit.', 'KS', 'purple', 'gavel', 6);

-- Case #1025: The Poisoned Gala
INSERT INTO CASE_ROSTER (roster_id, case_id, agent_key, display_name, role_type, persona, initials, color, icon, sequence_order)
VALUES ('r-1025-1', 'case-1025', 'dr_thorne', 'Dr. Aris Thorne', 'FORENSICS', 'Chief Medical Examiner and toxicology specialist. Analyzes cyanide absorption rate, time-of-death markers, dosage calculations, and the champagne flute contamination method with surgical precision.', 'AT', 'cyan', 'flask', 1);

INSERT INTO CASE_ROSTER (roster_id, case_id, agent_key, display_name, role_type, persona, initials, color, icon, sequence_order)
VALUES ('r-1025-2', 'case-1025', 'chief_bradley', 'Chief Bradley', 'SPECIALIST', 'Hotel Head of Security with military intelligence background. Reports on VIP lounge card-swipe access logs, private elevator usage, ballroom surveillance camera angles, and staff movement patterns.', 'CB', 'amber', 'shield', 2);

INSERT INTO CASE_ROSTER (roster_id, case_id, agent_key, display_name, role_type, persona, initials, color, icon, sequence_order)
VALUES ('r-1025-3', 'case-1025', 'julian_ashford', 'Julian Ashford', 'WITNESS_ANALYST', 'Arthur lifelong friend and gala co-chair. Testifies about Arthur recent paranoia, secret boardroom arguments with Elena, Marcus desperate late-night phone calls, and the mysterious sommelier Arthur did not personally hire.', 'JA', 'rose', 'wine', 3);

INSERT INTO CASE_ROSTER (roster_id, case_id, agent_key, display_name, role_type, persona, initials, color, icon, sequence_order)
VALUES ('r-1025-4', 'case-1025', 'agent_kapoor', 'Agent Priya Kapoor', 'PROFILER', 'Financial fraud investigator from the white-collar crime division. Traces offshore bank transfers, casino debt collection networks, patent licensing irregularities, and forged identity paper trails.', 'PK', 'indigo', 'banknote', 4);

INSERT INTO CASE_ROSTER (roster_id, case_id, agent_key, display_name, role_type, persona, initials, color, icon, sequence_order)
VALUES ('r-1025-5', 'case-1025', 'inspector_moreau', 'Inspector Moreau', 'COORDINATOR', 'Lead investigator with 22 years in homicide. Coordinates findings from all specialists, identifies critical gaps, and directs the next phase of the investigation with calm authority.', 'IM', 'blue', 'search', 5);

INSERT INTO CASE_ROSTER (roster_id, case_id, agent_key, display_name, role_type, persona, initials, color, icon, sequence_order)
VALUES ('r-1025-6', 'case-1025', 'prosecutor_holt', 'Prosecutor Diane Holt', 'LEGAL_REVIEW', 'Senior prosecutor specializing in high-profile poisoning cases. Evaluates whether the physical and circumstantial evidence establishes a clear chain from suspect to cyanide to champagne flute.', 'DH', 'purple', 'gavel', 6);

-- Case #1026: The Midnight Pier Mystery
INSERT INTO CASE_ROSTER (roster_id, case_id, agent_key, display_name, role_type, persona, initials, color, icon, sequence_order)
VALUES ('r-1026-1', 'case-1026', 'officer_kowalski', 'Officer Kowalski', 'COORDINATOR', 'Harbor Patrol first responder with 15 years maritime law enforcement experience. Discovered the body, secured the scene perimeter, and directs the multi-agency investigation team.', 'OK', 'blue', 'anchor', 1);

INSERT INTO CASE_ROSTER (roster_id, case_id, agent_key, display_name, role_type, persona, initials, color, icon, sequence_order)
VALUES ('r-1026-2', 'case-1026', 'frankie_miller', 'Frankie Miller', 'WITNESS_ANALYST', 'Dock night watchman known as Nightowl, has patrolled these piers for 8 years. Reports on engine sounds heard at 1:10 AM, silhouettes seen near Pier 14, and the suspicious truck that left Gate 4 at 1:25 AM.', 'FM', 'amber', 'eye', 2);

INSERT INTO CASE_ROSTER (roster_id, case_id, agent_key, display_name, role_type, persona, initials, color, icon, sequence_order)
VALUES ('r-1026-3', 'case-1026', 'agent_cross', 'Agent Maya Cross', 'SPECIALIST', 'Maritime Customs and Logistics specialist from federal port authority. Traces forged cargo manifests, vessel mooring logs, contraband smuggling routes, and the missing Sea Sovereign shipping documents.', 'MC', 'teal', 'ship', 3);

INSERT INTO CASE_ROSTER (roster_id, case_id, agent_key, display_name, role_type, persona, initials, color, icon, sequence_order)
VALUES ('r-1026-4', 'case-1026', 'diver_hayes', 'Forensic Diver Hayes', 'FORENSICS', 'Crime scene dive unit leader. Analyzes the retrieved bronze mooring wrench, blood spatter on bollards, tide-adjusted drowning timeline, and silt composition matching boot print forensics.', 'FH', 'cyan', 'microscope', 4);

INSERT INTO CASE_ROSTER (roster_id, case_id, agent_key, display_name, role_type, persona, initials, color, icon, sequence_order)
VALUES ('r-1026-5', 'case-1026', 'det_ruiz', 'Det. Carla Ruiz', 'INTERROGATOR', 'Interrogation specialist with expertise in maritime criminal networks. Challenges alibi inconsistencies head-on and is known for rapid-fire timeline cross-examination techniques.', 'CR', 'emerald', 'mic', 5);

INSERT INTO CASE_ROSTER (roster_id, case_id, agent_key, display_name, role_type, persona, initials, color, icon, sequence_order)
VALUES ('r-1026-6', 'case-1026', 'da_walsh', 'District Attorney Walsh', 'LEGAL_REVIEW', 'Reviews indictment readiness against maritime jurisdiction rules. Specializes in port authority criminal cases and evaluates whether the thermal camera footage and RFID logs constitute admissible evidence.', 'DW', 'purple', 'gavel', 6);
