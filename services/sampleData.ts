
export interface Sample {
    name: string;
    type: 'ged' | 'txt';
    content: string;
}

export const royalGedcom = `
0 @I1@ INDI
1 NAME Elizabeth II
1 SEX F
1 FAMS @F1@
1 FAMC @F7@
0 @I2@ INDI
1 NAME Philip Mountbatten
1 SEX M
1 FAMS @F1@
1 FAMC @F300@
0 @I3@ INDI
1 NAME Charles III
1 SEX M
1 FAMC @F1@
1 FAMS @F2@
1 FAMS @F3@
0 @I4@ INDI
1 NAME Diana Spencer
1 SEX F
1 FAMS @F2@
0 @I5@ INDI
1 NAME Camilla Parker Bowles
1 SEX F
1 FAMS @F3@
0 @I6@ INDI
1 NAME William, Prince of Wales
1 SEX M
1 FAMC @F2@
1 FAMS @F4@
0 @I7@ INDI
1 NAME Catherine Middleton
1 SEX F
1 FAMS @F4@
0 @I8@ INDI
1 NAME Prince George of Wales
1 SEX M
1 FAMC @F4@
0 @I9@ INDI
1 NAME Princess Charlotte of Wales
1 SEX F
1 FAMC @F4@
0 @I10@ INDI
1 NAME Prince Louis of Wales
1 SEX M
1 FAMC @F4@
0 @I11@ INDI
1 NAME Prince Harry, Duke of Sussex
1 SEX M
1 FAMC @F2@
1 FAMS @F5@
0 @I12@ INDI
1 NAME Meghan Markle
1 SEX F
1 FAMS @F5@
0 @I13@ INDI
1 NAME Prince Archie of Sussex
1 SEX M
1 FAMC @F5@
0 @I14@ INDI
1 NAME Princess Lilibet of Sussex
1 SEX F
1 FAMC @F5@
0 @I15@ INDI
1 NAME Anne, Princess Royal
1 SEX F
1 FAMC @F1@
0 @I16@ INDI
1 NAME Prince Andrew, Duke of York
1 SEX M
1 FAMC @F1@
0 @I17@ INDI
1 NAME Prince Edward, Duke of Edinburgh
1 SEX M
1 FAMC @F1@
0 @I18@ INDI
1 NAME George VI
1 SEX M
1 FAMS @F7@
1 FAMC @F20@
0 @I19@ INDI
1 NAME Elizabeth Bowes-Lyon
1 SEX F
1 FAMS @F7@
0 @I21@ INDI
1 NAME George V
1 SEX M
1 FAMS @F20@
1 FAMC @F21@
0 @I22@ INDI
1 NAME Mary of Teck
1 SEX F
1 FAMS @F20@
0 @I23@ INDI
1 NAME Edward VII
1 SEX M
1 FAMS @F21@
1 FAMC @F22@
0 @I24@ INDI
1 NAME Alexandra of Denmark
1 SEX F
1 FAMS @F21@
1 FAMC @F23@
0 @I25@ INDI
1 NAME Queen Victoria
1 SEX F
1 FAMS @F22@
1 FAMC @F24@
0 @I26@ INDI
1 NAME Albert of Saxe-Coburg and Gotha
1 SEX M
1 FAMS @F22@
0 @I27@ INDI
1 NAME Victoria, Princess Royal
1 SEX F
1 FAMC @F22@
1 FAMS @F25@
0 @I28@ INDI
1 NAME Frederick III, German Emperor
1 SEX M
1 FAMS @F25@
0 @I29@ INDI
1 NAME Kaiser Wilhelm II
1 SEX M
1 FAMC @F25@
0 @I30@ INDI
1 NAME Alice, Grand Duchess of Hesse
1 SEX F
1 FAMC @F22@
1 FAMS @F26@
0 @I31@ INDI
1 NAME Louis IV, Grand Duke of Hesse
1 SEX M
1 FAMS @F26@
0 @I32@ INDI
1 NAME Alix of Hesse, Empress Alexandra Feodorovna
1 SEX F
1 FAMC @F26@
1 FAMS @F27@
0 @I33@ INDI
1 NAME Nicholas II of Russia
1 SEX M
1 FAMS @F27@
1 FAMC @F28@
0 @I34@ INDI
1 NAME Alfred, Duke of Saxe-Coburg and Gotha
1 SEX M
1 FAMC @F22@
0 @I35@ INDI
1 NAME Helena, Princess Christian of Schleswig-Holstein
1 SEX F
1 FAMC @F22@
0 @I36@ INDI
1 NAME Louise, Duchess of Argyll
1 SEX F
1 FAMC @F22@
0 @I37@ INDI
1 NAME Arthur, Duke of Connaught and Strathearn
1 SEX M
1 FAMC @F22@
0 @I38@ INDI
1 NAME Leopold, Duke of Albany
1 SEX M
1 FAMC @F22@
0 @I39@ INDI
1 NAME Beatrice, Princess Henry of Battenberg
1 SEX F
1 FAMC @F22@
1 FAMS @F29@
0 @I40@ INDI
1 NAME Victoria Eugenie of Battenberg
1 SEX F
1 FAMC @F29@
1 FAMS @F30@
0 @I41@ INDI
1 NAME Alfonso XIII of Spain
1 SEX M
1 FAMS @F30@
0 @I42@ INDI
1 NAME Christian IX of Denmark
1 SEX M
1 FAMS @F23@
0 @I43@ INDI
1 NAME Louise of Hesse-Kassel
1 SEX F
1 FAMS @F23@
0 @I44@ INDI
1 NAME Frederick VIII of Denmark
1 SEX M
1 FAMC @F23@
0 @I45@ INDI
1 NAME George I of Greece
1 SEX M
1 FAMC @F23@
1 FAMS @F300@
0 @I46@ INDI
1 NAME Dagmar of Denmark, Empress Maria Feodorovna
1 SEX F
1 FAMC @F23@
1 FAMS @F28@
0 @I47@ INDI
1 NAME Alexander III of Russia
1 SEX M
1 FAMS @F28@
0 @I48@ INDI
1 NAME Thyra of Denmark
1 SEX F
1 FAMC @F23@
0 @I49@ INDI
1 NAME Valdemar of Denmark
1 SEX M
1 FAMC @F23@
0 @I50@ INDI
1 NAME Edward, Duke of Kent
1 SEX M
1 FAMS @F24@
1 FAMC @F50@
0 @I51@ INDI
1 NAME Victoria of Saxe-Coburg-Saalfeld
1 SEX F
1 FAMS @F24@
0 @I52@ INDI
1 NAME George III
1 SEX M
1 FAMS @F50@
1 FAMC @F51@
0 @I53@ INDI
1 NAME Charlotte of Mecklenburg-Strelitz
1 SEX F
1 FAMS @F50@
0 @I54@ INDI
1 NAME George IV
1 SEX M
1 FAMC @F50@
0 @I55@ INDI
1 NAME Frederick, Duke of York
1 SEX M
1 FAMC @F50@
0 @I56@ INDI
1 NAME William IV
1 SEX M
1 FAMC @F50@
0 @I57@ INDI
1 NAME Princess Charlotte Augusta of Wales
1 SEX F
1 FAMC @F50@
0 @I58@ INDI
1 NAME Ernest Augustus, King of Hanover
1 SEX M
1 FAMC @F50@
0 @I59@ INDI
1 NAME Prince Augustus, Duke of Sussex
1 SEX M
1 FAMC @F50@
0 @I60@ INDI
1 NAME Prince Adolphus, Duke of Cambridge
1 SEX M
1 FAMC @F50@
0 @I61@ INDI
1 NAME Frederick, Prince of Wales
1 SEX M
1 FAMS @F51@
1 FAMC @F52@
0 @I62@ INDI
1 NAME Princess Augusta of Saxe-Gotha
1 SEX F
1 FAMS @F51@
0 @I63@ INDI
1 NAME George II
1 SEX M
1 FAMS @F52@
1 FAMC @F53@
0 @I64@ INDI
1 NAME Caroline of Ansbach
1 SEX F
1 FAMS @F52@
0 @I65@ INDI
1 NAME George I
1 SEX M
1 FAMS @F53@
1 FAMC @F54@
0 @I66@ INDI
1 NAME Sophia Dorothea of Celle
1 SEX F
1 FAMS @F53@
0 @I67@ INDI
1 NAME Ernest Augustus, Elector of Hanover
1 SEX M
1 FAMS @F54@
0 @I68@ INDI
1 NAME Sophia of Hanover
1 SEX F
1 FAMS @F54@
1 FAMC @F55@
0 @I69@ INDI
1 NAME Frederick V of the Palatinate
1 SEX M
1 FAMS @F55@
0 @I70@ INDI
1 NAME Elizabeth Stuart
1 SEX F
1 FAMS @F55@
1 FAMC @F56@
0 @I71@ INDI
1 NAME James VI and I
1 SEX M
1 FAMS @F56@
1 FAMC @F57@
0 @I72@ INDI
1 NAME Anne of Denmark
1 SEX F
1 FAMS @F56@
0 @I73@ INDI
1 NAME Henry Frederick, Prince of Wales
1 SEX M
1 FAMC @F56@
0 @I74@ INDI
1 NAME Charles I
1 SEX M
1 FAMC @F56@
1 FAMS @F58@
0 @I75@ INDI
1 NAME Henrietta Maria of France
1 SEX F
1 FAMS @F58@
1 FAMC @F59@
0 @I76@ INDI
1 NAME Charles II
1 SEX M
1 FAMC @F58@
0 @I77@ INDI
1 NAME Mary, Princess Royal
1 SEX F
1 FAMC @F58@
1 FAMS @F60@
0 @I78@ INDI
1 NAME James II
1 SEX M
1 FAMC @F58@
1 FAMS @F61@
1 FAMS @F62@
0 @I79@ INDI
1 NAME Mary of Modena
1 SEX F
1 FAMS @F62@
0 @I80@ INDI
1 NAME Anne Hyde
1 SEX F
1 FAMS @F61@
0 @I81@ INDI
1 NAME Mary II
1 SEX F
1 FAMC @F61@
1 FAMS @F63@
0 @I82@ INDI
1 NAME Anne, Queen of Great Britain
1 SEX F
1 FAMC @F61@
0 @I83@ INDI
1 NAME James Francis Edward Stuart
1 SEX M
1 FAMC @F62@
0 @I84@ INDI
1 NAME William III
1 SEX M
1 FAMC @F60@
1 FAMS @F63@
0 @I85@ INDI
1 NAME William II, Prince of Orange
1 SEX M
1 FAMS @F60@
0 @I86@ INDI
1 NAME Henry IV of France
1 SEX M
1 FAMS @F59@
0 @I87@ INDI
1 NAME Marie de' Medici
1 SEX F
1 FAMS @F59@
0 @I88@ INDI
1 NAME Mary, Queen of Scots
1 SEX F
1 FAMS @F57@
1 FAMC @F64@
0 @I89@ INDI
1 NAME Henry Stuart, Lord Darnley
1 SEX M
1 FAMS @F57@
0 @I90@ INDI
1 NAME James V of Scotland
1 SEX M
1 FAMS @F64@
0 @I91@ INDI
1 NAME Mary of Guise
1 SEX F
1 FAMS @F64@
0 @I92@ INDI
1 NAME Olga Constantinovna of Russia
1 SEX F
1 FAMS @F300@
0 @I93@ INDI
1 NAME Prince Andrew of Greece and Denmark
1 SEX M
1 FAMC @F300@
0 @I94@ INDI
1 NAME Juan Carlos I of Spain
1 SEX M
1 FAMC @F30@
0 @I95@ INDI
1 NAME Felipe VI of Spain
1 SEX M
1 FAMC @F94@
0 @I96@ INDI
1 NAME Queen Sofia of Spain
1 SEX F
1 FAMS @F94@
1 FAMC @F301@
0 @I97@ INDI
1 NAME Paul of Greece
1 SEX M
1 FAMS @F301@
0 @I98@ INDI
1 NAME Frederica of Hanover
1 SEX F
1 FAMS @F301@
0 @I99@ INDI
1 NAME Constantine II of Greece
1 SEX M
1 FAMC @F301@
0 @I100@ INDI
1 NAME Christian X of Denmark
1 SEX M
1 FAMC @F44@
0 @I101@ INDI
1 NAME Haakon VII of Norway
1 SEX M
1 FAMC @F44@
0 @I102@ INDI
1 NAME Maud of Wales
1 SEX F
1 FAMC @F21@
1 FAMS @F101@
0 @I103@ INDI
1 NAME Olav V of Norway
1 SEX M
1 FAMC @F101@
0 @I104@ INDI
1 NAME Harald V of Norway
1 SEX M
1 FAMC @F103@
0 @I105@ INDI
1 NAME Grand Duchess Anastasia Nikolaevna
1 SEX F
1 FAMC @F27@
0 @I106@ INDI
1 NAME Grand Duchess Tatiana Nikolaevna
1 SEX F
1 FAMC @F27@
0 @I107@ INDI
1 NAME Grand Duchess Maria Nikolaevna
1 SEX F
1 FAMC @F27@
0 @I108@ INDI
1 NAME Grand Duchess Olga Nikolaevna
1 SEX F
1 FAMC @F27@
0 @I109@ INDI
1 NAME Tsarevich Alexei Nikolaevich
1 SEX M
1 FAMC @F27@
0 @I110@ INDI
1 NAME Henry VIII
1 SEX M
1 FAMC @F111@
0 @I111@ INDI
1 NAME Henry VII
1 SEX M
1 FAMS @F111@
0 @I112@ INDI
1 NAME Elizabeth of York
1 SEX F
1 FAMS @F111@
0 @I113@ INDI
1 NAME Louis XIV of France
1 SEX M
0 @I114@ INDI
1 NAME Peter the Great
1 SEX M
0 @I115@ INDI
1 NAME Catherine the Great
1 SEX F
0 @I116@ INDI
1 NAME Frederick the Great
1 SEX M
0 @I117@ INDI
1 NAME Maria Theresa
1 SEX F
0 @I118@ INDI
1 NAME Napoleon Bonaparte
1 SEX M
0 @I119@ INDI
1 NAME Charles V, Holy Roman Emperor
1 SEX M
0 @I120@ INDI
1 NAME Philip II of Spain
1 SEX M
0 @I121@ INDI
1 NAME William the Conqueror
1 SEX M
0 @I122@ INDI
1 NAME Richard I of England
1 SEX M
0 @I123@ INDI
1 NAME Eleanor of Aquitaine
1 SEX F
0 @I124@ INDI
1 NAME Charlemagne
1 SEX M
0 @I125@ INDI
1 NAME Otto von Bismarck
1 SEX M
0 @I126@ INDI
1 NAME Leopold I of Belgium
1 SEX M
1 FAMC @F24@
0 @I127@ INDI
1 NAME Carl XVI Gustaf of Sweden
1 SEX M
0 @I128@ INDI
1 NAME Queen Margrethe II of Denmark
1 SEX F
0 @I129@ INDI
1 NAME Queen Beatrix of the Netherlands
1 SEX F
0 @I130@ INDI
1 NAME Emperor Meiji
1 SEX M
0 @I131@ INDI
1 NAME Suleiman the Magnificent
1 SEX M
0 @I132@ INDI
1 NAME Akbar the Great
1 SEX M
0 @I133@ INDI
1 NAME Genghis Khan
1 SEX M
0 @I134@ INDI
1 NAME Kublai Khan
1 SEX M
0 @I135@ INDI
1 NAME Augustus
1 SEX M
0 @I136@ INDI
1 NAME Julius Caesar
1 SEX M
0 @I137@ INDI
1 NAME Alexander the Great
1 SEX M
0 @I138@ INDI
1 NAME Pericles
1 SEX M
0 @I139@ INDI
1 NAME Hammurabi
1 SEX M
0 @I140@ INDI
1 NAME Sargon of Akkad
1 SEX M
0 @I141@ INDI
1 NAME Ashurbanipal
1 SEX M
0 @I142@ INDI
1 NAME Cyrus the Great
1 SEX M
0 @I143@ INDI
1 NAME Darius I
1 SEX M
0 @I144@ INDI
1 NAME Xerxes I
1 SEX M
0 @I145@ INDI
1 NAME Leonidas I
1 SEX M
0 @I146@ INDI
1 NAME Philip II of Macedon
1 SEX M
0 @I147@ INDI
1 NAME Ptolemy I Soter
1 SEX M
0 @I148@ INDI
1 NAME Cleopatra VII
1 SEX F
0 @I149@ INDI
1 NAME Mark Antony
1 SEX M
0 @I150@ INDI
1 NAME Constantine the Great
1 SEX M
0 @I151@ INDI
1 NAME Justinian I
1 SEX M
0 @I152@ INDI
1 NAME Theodora
1 SEX F
0 @I153@ INDI
1 NAME Clovis I
1 SEX M
0 @I154@ INDI
1 NAME Charles Martel
1 SEX M
0 @I155@ INDI
1 NAME Alfred the Great
1 SEX M
0 @I156@ INDI
1 NAME Cnut the Great
1 SEX M
0 @I157@ INDI
1 NAME Harold Godwinson
1 SEX M
0 @I158@ INDI
1 NAME Henry II of England
1 SEX M
0 @I159@ INDI
1 NAME John of England
1 SEX M
0 @I160@ INDI
1 NAME Edward I of England
1 SEX M
0 @I161@ INDI
1 NAME Robert the Bruce
1 SEX M
0 @I162@ INDI
1 NAME Edward III of England
1 SEX M
0 @I163@ INDI
1 NAME Henry V of England
1 SEX M
0 @I164@ INDI
1 NAME Richard III of England
1 SEX M
0 @I165@ INDI
1 NAME Ivan the Terrible
1 SEX M
0 @I166@ INDI
1 NAME Gustavus Adolphus
1 SEX M
0 @I167@ INDI
1 NAME Louis XIII of France
1 SEX M
0 @I168@ INDI
1 NAME Cardinal Richelieu
1 SEX M
0 @I169@ INDI
1 NAME Oliver Cromwell
1 SEX M
0 @I170@ INDI
1 NAME Charles XII of Sweden
1 SEX M
0 @I171@ INDI
1 NAME Maria I of Portugal
1 SEX F
0 @I172@ INDI
1 NAME Joseph II, Holy Roman Emperor
1 SEX M
0 @I173@ INDI
1 NAME Leopold II, Holy Roman Emperor
1 SEX M
0 @I174@ INDI
1 NAME Francis II, Holy Roman Emperor
1 SEX M
0 @I175@ INDI
1 NAME Ferdinand VII of Spain
1 SEX M
0 @I176@ INDI
1 NAME Isabella II of Spain
1 SEX F
0 @I177@ INDI
1 NAME Victor Emmanuel II of Italy
1 SEX M
0 @I178@ INDI
1 NAME Umberto I of Italy
1 SEX M
0 @I179@ INDI
1 NAME Victor Emmanuel III of Italy
1 SEX M
0 @I180@ INDI
1 NAME Franz Joseph I of Austria
1 SEX M
0 @I181@ INDI
1 NAME Empress Elisabeth of Austria
1 SEX F
0 @I182@ INDI
1 NAME Maximilian I of Mexico
1 SEX M
0 @I183@ INDI
1 NAME Ludwig II of Bavaria
1 SEX M
0 @I184@ INDI
1 NAME Pedro II of Brazil
1 SEX M
0 @I185@ INDI
1 NAME Abdul Hamid II
1 SEX M
0 @I186@ INDI
1 NAME Cixi
1 SEX F
0 @I187@ INDI
1 NAME Emperor Guangxu
1 SEX M
0 @I188@ INDI
1 NAME Puyi
1 SEX M
0 @I189@ INDI
1 NAME Wilhelm I, German Emperor
1 SEX M
0 @I190@ INDI
1 NAME Otto I of Greece
1 SEX M
0 @I191@ INDI
1 NAME Carol I of Romania
1 SEX M
0 @I192@ INDI
1 NAME Ferdinand I of Bulgaria
1 SEX M
0 @I193@ INDI
1 NAME Alexander I of Yugoslavia
1 SEX M
0 @I194@ INDI
1 NAME Zog I of Albania
1 SEX M
0 @I195@ INDI
1 NAME Haile Selassie I
1 SEX M
0 @I196@ INDI
1 NAME Reza Shah Pahlavi
1 SEX M
0 @I197@ INDI
1 NAME Mohammed Reza Pahlavi
1 SEX M
0 @I198@ INDI
1 NAME Faisal I of Iraq
1 SEX M
0 @I199@ INDI
1 NAME Abdullah I of Jordan
1 SEX M
0 @I200@ INDI
1 NAME Hussein of Jordan
1 SEX M
0 @I201@ INDI
1 NAME Edward VIII
1 SEX M
1 FAMC @F20@
0 @I202@ INDI
1 NAME John, Prince
1 SEX M
1 FAMC @F20@
0 @I203@ INDI
1 NAME Prince Albert Victor, Duke of Clarence
1 SEX M
1 FAMC @F21@
0 @I204@ INDI
1 NAME Louise, Princess Royal
1 SEX F
1 FAMC @F21@
0 @I205@ INDI
1 NAME Victoria, Princess
1 SEX F
1 FAMC @F21@
0 @I206@ INDI
1 NAME Sophie, Queen of the Hellenes
1 SEX F
1 FAMC @F25@
0 @I207@ INDI
1 NAME George II of Greece
1 SEX M
1 FAMC @F206@
0 @I208@ INDI
1 NAME Alexander of Greece
1 SEX M
1 FAMC @F206@
0 @I209@ INDI
1 NAME Princess Irene, Duchess of Aosta
1 SEX F
1 FAMC @F206@
0 @I210@ INDI
1 NAME Princess Katherine of Greece and Denmark
1 SEX F
1 FAMC @F206@
0 @I211@ INDI
1 NAME Grand Duchess Elizabeth Feodorovna
1 SEX F
1 FAMC @F26@
0 @I212@ INDI
1 NAME Princess Irene of Hesse and by Rhine
1 SEX F
1 FAMC @F26@
0 @I213@ INDI
1 NAME Ernest Louis, Grand Duke of Hesse
1 SEX M
1 FAMC @F26@
0 @I214@ INDI
1 NAME Princess Margarita of Greece and Denmark
1 SEX F
1 FAMC @F93@
0 @I215@ INDI
1 NAME Princess Theodora of Greece and Denmark
1 SEX F
1 FAMC @F93@
0 @I216@ INDI
1 NAME Princess Cecilie of Greece and Denmark
1 SEX F
1 FAMC @F93@
0 @I217@ INDI
1 NAME Princess Sophie of Greece and Denmark
1 SEX F
1 FAMC @F93@
0 @I218@ INDI
1 NAME King Michael I of Romania
1 SEX M
0 @I219@ INDI
1 NAME Queen Anne of Romania
1 SEX F
0 @I220@ INDI
1 NAME Tsar Simeon II of Bulgaria
1 SEX M
0 @I221@ INDI
1 NAME King Juan Carlos of Spain
1 SEX M
0 @I222@ INDI
1 NAME King Constantine II of Greece
1 SEX M
0 @I223@ INDI
1 NAME Queen Anne-Marie of Greece
1 SEX F
0 @I224@ INDI
1 NAME Crown Princess Victoria of Sweden
1 SEX F
0 @I225@ INDI
1 NAME Crown Prince Haakon of Norway
1 SEX M
0 @I226@ INDI
1 NAME Crown Prince Frederik of Denmark
1 SEX M
0 @I227@ INDI
1 NAME King Willem-Alexander of the Netherlands
1 SEX M
0 @I228@ INDI
1 NAME King Philippe of Belgium
1 SEX M
0 @I229@ INDI
1 NAME Grand Duke Henri of Luxembourg
1 SEX M
0 @I230@ INDI
1 NAME Prince Albert II of Monaco
1 SEX M
0 @I231@ INDI
1 NAME Emperor Akihito
1 SEX M
0 @I232@ INDI
1 NAME Emperor Naruhito
1 SEX M
0 @I233@ INDI
1 NAME King Jigme Khesar Namgyel Wangchuck
1 SEX M
0 @I234@ INDI
1 NAME King Abdullah II of Jordan
1 SEX M
0 @I235@ INDI
1 NAME King Mohammed VI of Morocco
1 SEX M
0 @I236@ INDI
1 NAME Sheikh Khalifa bin Zayed Al Nahyan
1 SEX M
0 @I237@ INDI
1 NAME Sheikh Mohammed bin Rashid Al Maktoum
1 SEX M
0 @I238@ INDI
1 NAME Sultan Qaboos bin Said al Said
1 SEX M
0 @I239@ INDI
1 NAME King Salman of Saudi Arabia
1 SEX M
0 @I240@ INDI
1 NAME King Mswati III
1 SEX M
0 @I241@ INDI
1 NAME Letsie III of Lesotho
1 SEX M
0 @I242@ INDI
1 NAME Tupou VI of Tonga
1 SEX M
0 @I243@ INDI
1 NAME Empress Catherine II of Russia
1 SEX F
0 @I244@ INDI
1 NAME Elizabeth I
1 SEX F
1 FAMC @F111@
0 @I245@ INDI
1 NAME Mary I
1 SEX F
1 FAMC @F111@
0 @I246@ INDI
1 NAME Edward VI
1 SEX M
1 FAMC @F111@
0 @I247@ INDI
1 NAME Louis XVI of France
1 SEX M
0 @I248@ INDI
1 NAME Marie Antoinette
1 SEX F
0 @I249@ INDI
1 NAME Maximilien Robespierre
1 SEX M
0 @I250@ INDI
1 NAME Napoleon III
1 SEX M
0 @I251@ INDI
1 NAME Garibaldi
1 SEX M
0 @I252@ INDI
1 NAME Metternich
1 SEX M
0 @I253@ INDI
1 NAME Simon Bolivar
1 SEX M
0 @I254@ INDI
1 NAME Toussaint Louverture
1 SEX M
0 @I255@ INDI
1 NAME Shaka Zulu
1 SEX M
0 @I256@ INDI
1 NAME Moctezuma II
1 SEX M
0 @I257@ INDI
1 NAME Atahualpa
1 SEX M
0 @I258@ INDI
1 NAME Pachacuti
1 SEX M
0 @I259@ INDI
1 NAME Isabella I of Castille
1 SEX F
0 @I260@ INDI
1 NAME Ferdinand II of Aragon
1 SEX M
0 @I261@ INDI
1 NAME Christopher Columbus
1 SEX M
0 @I262@ INDI
1 NAME Vasco da Gama
1 SEX M
0 @I263@ INDI
1 NAME Ferdinand Magellan
1 SEX M
0 @I264@ INDI
1 NAME Hernan Cortes
1 SEX M
0 @I265@ INDI
1 NAME Francisco Pizarro
1 SEX M
0 @I266@ INDI
1 NAME Francis Drake
1 SEX M
0 @I267@ INDI
1 NAME Walter Raleigh
1 SEX M
0 @I268@ INDI
1 NAME John Smith
1 SEX M
0 @I269@ INDI
1 NAME Pocahontas
1 SEX F
0 @I270@ INDI
1 NAME William Bradford
1 SEX M
0 @I271@ INDI
1 NAME John Winthrop
1 SEX M
0 @I272@ INDI
1 NAME William Penn
1 SEX M
0 @I273@ INDI
1 NAME Benjamin Franklin
1 SEX M
0 @I274@ INDI
1 NAME George Washington
1 SEX M
0 @I275@ INDI
1 NAME Thomas Jefferson
1 SEX M
0 @I276@ INDI
1 NAME John Adams
1 SEX M
0 @I277@ INDI
1 NAME James Madison
1 SEX M
0 @I278@ INDI
1 NAME Alexander Hamilton
1 SEX M
0 @I279@ INDI
1 NAME Abraham Lincoln
1 SEX M
0 @I280@ INDI
1 NAME Theodore Roosevelt
1 SEX M
0 @I281@ INDI
1 NAME Franklin D. Roosevelt
1 SEX M
0 @I282@ INDI
1 NAME Winston Churchill
1 SEX M
0 @I283@ INDI
1 NAME Charles de Gaulle
1 SEX M
0 @I284@ INDI
1 NAME Joseph Stalin
1 SEX M
0 @I285@ INDI
1 NAME Vladimir Lenin
1 SEX M
0 @I286@ INDI
1 NAME Leon Trotsky
1 SEX M
0 @I287@ INDI
1 NAME Mao Zedong
1 SEX M
0 @I288@ INDI
1 NAME Chiang Kai-shek
1 SEX M
0 @I289@ INDI
1 NAME Mahatma Gandhi
1 SEX M
0 @I290@ INDI
1 NAME Jawaharlal Nehru
1 SEX M
0 @I291@ INDI
1 NAME Nelson Mandela
1 SEX M
0 @I292@ INDI
1 NAME Martin Luther King Jr.
1 SEX M
0 @I293@ INDI
1 NAME Queen Salote Tupou III
1 SEX F
0 @I294@ INDI
1 NAME Liliuokalani
1 SEX F
0 @I295@ INDI
1 NAME Kamehameha I
1 SEX M
0 @I296@ INDI
1 NAME Sitting Bull
1 SEX M
0 @I297@ INDI
1 NAME Geronimo
1 SEX M
0 @I298@ INDI
1 NAME Crazy Horse
1 SEX M
0 @I299@ INDI
1 NAME Tecumseh
1 SEX M
0 @I300@ INDI
1 NAME Sacagawea
1 SEX F
0 @F1@ FAM
1 HUSB @I2@
1 WIFE @I1@
1 CHIL @I3@
1 CHIL @I15@
1 CHIL @I16@
1 CHIL @I17@
0 @F2@ FAM
1 HUSB @I3@
1 WIFE @I4@
1 CHIL @I6@
1 CHIL @I11@
0 @F3@ FAM
1 HUSB @I3@
1 WIFE @I5@
0 @F4@ FAM
1 HUSB @I6@
1 WIFE @I7@
1 CHIL @I8@
1 CHIL @I9@
1 CHIL @I10@
0 @F5@ FAM
1 HUSB @I11@
1 WIFE @I12@
1 CHIL @I13@
1 CHIL @I14@
0 @F7@ FAM
1 HUSB @I18@
1 WIFE @I19@
1 CHIL @I1@
0 @F20@ FAM
1 HUSB @I21@
1 WIFE @I22@
1 CHIL @I18@
1 CHIL @I201@
1 CHIL @I202@
0 @F21@ FAM
1 HUSB @I23@
1 WIFE @I24@
1 CHIL @I21@
1 CHIL @I102@
1 CHIL @I203@
1 CHIL @I204@
1 CHIL @I205@
0 @F22@ FAM
1 HUSB @I26@
1 WIFE @I25@
1 CHIL @I27@
1 CHIL @I23@
1 CHIL @I30@
1 CHIL @I34@
1 CHIL @I35@
1 CHIL @I36@
1 CHIL @I37@
1 CHIL @I38@
1 CHIL @I39@
0 @F23@ FAM
1 HUSB @I42@
1 WIFE @I43@
1 CHIL @I24@
1 CHIL @I44@
1 CHIL @I45@
1 CHIL @I46@
1 CHIL @I48@
1 CHIL @I49@
0 @F24@ FAM
1 HUSB @I50@
1 WIFE @I51@
1 CHIL @I25@
1 CHIL @I126@
0 @F25@ FAM
1 HUSB @I28@
1 WIFE @I27@
1 CHIL @I29@
1 CHIL @I206@
0 @F26@ FAM
1 HUSB @I31@
1 WIFE @I30@
1 CHIL @I32@
1 CHIL @I211@
1 CHIL @I212@
1 CHIL @I213@
0 @F27@ FAM
1 HUSB @I33@
1 WIFE @I32@
1 CHIL @I105@
1 CHIL @I106@
1 CHIL @I107@
1 CHIL @I108@
1 CHIL @I109@
0 @F28@ FAM
1 HUSB @I47@
1 WIFE @I46@
1 CHIL @I33@
0 @F29@ FAM
1 HUSB @I29@
1 WIFE @I39@
1 CHIL @I40@
0 @F30@ FAM
1 HUSB @I41@
1 WIFE @I40@
1 CHIL @I94@
0 @F50@ FAM
1 HUSB @I52@
1 WIFE @I53@
1 CHIL @I50@
1 CHIL @I54@
1 CHIL @I55@
1 CHIL @I56@
1 CHIL @I57@
1 CHIL @I58@
1 CHIL @I59@
1 CHIL @I60@
0 @F51@ FAM
1 HUSB @I61@
1 WIFE @I62@
1 CHIL @I52@
0 @F52@ FAM
1 HUSB @I63@
1 WIFE @I64@
1 CHIL @I61@
0 @F53@ FAM
1 HUSB @I65@
1 WIFE @I66@
1 CHIL @I63@
0 @F54@ FAM
1 HUSB @I67@
1 WIFE @I68@
1 CHIL @I65@
0 @F55@ FAM
1 HUSB @I69@
1 WIFE @I70@
1 CHIL @I68@
0 @F56@ FAM
1 HUSB @I71@
1 WIFE @I72@
1 CHIL @I70@
1 CHIL @I73@
1 CHIL @I74@
0 @F57@ FAM
1 HUSB @I89@
1 WIFE @I88@
1 CHIL @I71@
0 @F58@ FAM
1 HUSB @I74@
1 WIFE @I75@
1 CHIL @I76@
1 CHIL @I77@
1 CHIL @I78@
0 @F59@ FAM
1 HUSB @I86@
1 WIFE @I87@
1 CHIL @I75@
0 @F60@ FAM
1 HUSB @I85@
1 WIFE @I77@
1 CHIL @I84@
0 @F61@ FAM
1 HUSB @I78@
1 WIFE @I80@
1 CHIL @I81@
1 CHIL @I82@
0 @F62@ FAM
1 HUSB @I78@
1 WIFE @I79@
1 CHIL @I83@
0 @F63@ FAM
1 HUSB @I84@
1 WIFE @I81@
0 @F64@ FAM
1 HUSB @I90@
1 WIFE @I91@
1 CHIL @I88@
0 @F93@ FAM
1 HUSB @I93@
1 WIFE @F214@
1 CHIL @I2@
1 CHIL @I214@
1 CHIL @I215@
1 CHIL @I216@
1 CHIL @I217@
0 @F94@ FAM
1 HUSB @I94@
1 WIFE @I96@
1 CHIL @I95@
0 @F101@ FAM
1 HUSB @I101@
1 WIFE @I102@
1 CHIL @I103@
0 @F103@ FAM
1 HUSB @F103@
1 WIFE @F103@
1 CHIL @I104@
0 @F111@ FAM
1 HUSB @I111@
1 WIFE @I112@
1 CHIL @I110@
1 CHIL @I244@
1 CHIL @I245@
1 CHIL @I246@
0 @F206@ FAM
1 HUSB @F206@
1 WIFE @I206@
1 CHIL @I207@
1 CHIL @I208@
1 CHIL @I97@
1 CHIL @I209@
1 CHIL @I210@
0 @F300@ FAM
1 HUSB @I45@
1 WIFE @I92@
1 CHIL @I93@
0 @F301@ FAM
1 HUSB @I97@
1 WIFE @I98@
1 CHIL @I96@
1 CHIL @I99@
`.trim();

export const greekMythologyGedcom = `
0 @I1@ INDI
1 NAME Chaos
0 @I2@ INDI
1 NAME Gaia
1 FAMC @F1@
1 FAMS @F2@
0 @I3@ INDI
1 NAME Uranus
1 FAMC @F1@
1 FAMS @F2@
0 @I4@ INDI
1 NAME Cronus
1 FAMC @F2@
1 FAMS @F3@
0 @I5@ INDI
1 NAME Rhea
1 FAMC @F2@
1 FAMS @F3@
0 @I6@ INDI
1 NAME Zeus
1 FAMC @F3@
1 FAMS @F4@
1 FAMS @F5@
1 FAMS @F6@
0 @I7@ INDI
1 NAME Hera
1 FAMC @F3@
1 FAMS @F4@
0 @I8@ INDI
1 NAME Poseidon
1 FAMC @F3@
0 @I9@ INDI
1 NAME Hades
1 FAMC @F3@
0 @I10@ INDI
1 NAME Hestia
1 FAMC @F3@
0 @I11@ INDI
1 NAME Demeter
1 FAMC @F3@
1 FAMS @F5@
0 @I12@ INDI
1 NAME Persephone
1 FAMC @F5@
0 @I13@ INDI
1 NAME Leto
1 FAMS @F6@
0 @I14@ INDI
1 NAME Apollo
1 FAMC @F6@
0 @I15@ INDI
1 NAME Artemis
1 FAMC @F6@
0 @I16@ INDI
1 NAME Ares
1 FAMC @F4@
0 @I17@ INDI
1 NAME Hephaestus
1 FAMC @F4@
0 @I18@ INDI
1 NAME Hebe
1 FAMC @F4@
0 @I19@ INDI
1 NAME Oceanus
1 FAMC @F2@
0 @I20@ INDI
1 NAME Tethys
1 FAMC @F2@
0 @F1@ FAM
1 CHIL @I2@
1 CHIL @I3@
0 @F2@ FAM
1 HUSB @I3@
1 WIFE @I2@
1 CHIL @I4@
1 CHIL @I5@
1 CHIL @I19@
1 CHIL @I20@
0 @F3@ FAM
1 HUSB @I4@
1 WIFE @I5@
1 CHIL @I6@
1 CHIL @I7@
1 CHIL @I8@
1 CHIL @I9@
1 CHIL @I10@
1 CHIL @I11@
0 @F4@ FAM
1 HUSB @I6@
1 WIFE @I7@
1 CHIL @I16@
1 CHIL @I17@
1 CHIL @I18@
0 @F5@ FAM
1 HUSB @I6@
1 WIFE @I11@
1 CHIL @I12@
0 @F6@ FAM
1 HUSB @I6@
1 WIFE @I13@
1 CHIL @I14@
1 CHIL @I15@
`.trim();

export const harryPotterContent = `
# Main Trio
Harry-Potter Ron-Weasley
Harry-Potter Hermione-Granger
Ron-Weasley Hermione-Granger
# Harry's Connections
Harry-Potter Albus-Dumbledore
Harry-Potter Rubeus-Hagrid
Harry-Potter Sirius-Black
Harry-Potter Remus-Lupin
Harry-Potter Ginny-Weasley
Harry-Potter Severus-Snape
Harry-Potter Lord-Voldemort
Harry-Potter Draco-Malfoy
Harry-Potter Neville-Longbottom
Harry-Potter Luna-Lovegood
Harry-Potter Dobby
Harry-Potter Cho-Chang
Harry-Potter Cedric-Diggory
Harry-Potter Gilderoy-Lockhart
Harry-Potter Parvati-Patil
# Weasley Family
Ron-Weasley Fred-Weasley
Ron-Weasley George-Weasley
Ron-Weasley Ginny-Weasley
Ron-Weasley Molly-Weasley
Ron-Weasley Arthur-Weasley
Ron-Weasley Percy-Weasley
Ron-Weasley Padma-Patil
Fred-Weasley George-Weasley
Molly-Weasley Arthur-Weasley
Ginny-Weasley Dean-Thomas
Bill-Weasley Fleur-Delacour
Arthur-Weasley Percy-Weasley
# Hermione's Connections
Hermione-Granger Rubeus-Hagrid
Hermione-Granger Minerva-McGonagall
Hermione-Granger Viktor-Krum
Hermione-Granger Gilderoy-Lockhart
# Dumbledore's Army & Gryffindor Students
Neville-Longbottom Luna-Lovegood
Neville-Longbottom Ginny-Weasley
Luna-Lovegood Ginny-Weasley
Dean-Thomas Seamus-Finnigan
Harry-Potter Seamus-Finnigan
# Hogwarts Staff
Albus-Dumbledore Minerva-McGonagall
Albus-Dumbledore Severus-Snape
Albus-Dumbledore Rubeus-Hagrid
Albus-Dumbledore Filius-Flitwick
Albus-Dumbledore Pomona-Sprout
Albus-Dumbledore Sybill-Trelawney
Albus-Dumbledore Dolores-Umbridge
Albus-Dumbledore Gilderoy-Lockhart
Albus-Dumbledore Argus-Filch
Minerva-McGonagall Dolores-Umbridge
Severus-Snape Dolores-Umbridge
Rubeus-Hagrid Argus-Filch
# The Order of the Phoenix (Marauders etc)
Sirius-Black Remus-Lupin
Sirius-Black James-Potter
Sirius-Black Peter-Pettigrew
Remus-Lupin James-Potter
Remus-Lupin Nymphadora-Tonks
James-Potter Lily-Potter
James-Potter Peter-Pettigrew
Albus-Dumbledore Mad-Eye-Moody
Mad-Eye-Moody Nymphadora-Tonks
Mad-Eye-Moody Kingsley-Shacklebolt
Arthur-Weasley Kingsley-Shacklebolt
# Death Eaters & Voldemort's Allies
Lord-Voldemort Bellatrix-Lestrange
Lord-Voldemort Lucius-Malfoy
Lord-Voldemort Peter-Pettigrew
Lord-Voldemort Severus-Snape
Lord-Voldemort Barty-Crouch-Jr
Bellatrix-Lestrange Narcissa-Malfoy
Bellatrix-Lestrange Rodolphus-Lestrange
Lucius-Malfoy Draco-Malfoy
Lucius-Malfoy Narcissa-Malfoy
Draco-Malfoy Vincent-Crabbe
Draco-Malfoy Gregory-Goyle
Draco-Malfoy Pansy-Parkinson
Fenrir-Greyback Remus-Lupin
Fenrir-Greyback Lord-Voldemort
# Ministry of Magic
Albus-Dumbledore Cornelius-Fudge
Harry-Potter Cornelius-Fudge
Cornelius-Fudge Dolores-Umbridge
Cornelius-Fudge Percy-Weasley
Harry-Potter Dolores-Umbridge
# Dark Wizards
Albus-Dumbledore Gellert-Grindelwald
Lord-Voldemort Gellert-Grindelwald
# Other relationships
Severus-Snape Lily-Potter
Kreacher Sirius-Black
Kreacher Regulus-Black
Regulus-Black Lord-Voldemort
Rita-Skeeter Harry-Potter
Rita-Skeeter Hermione-Granger
Garrick-Ollivander Harry-Potter
Garrick-Ollivander Lord-Voldemort
Cedric-Diggory Cho-Chang
Viktor-Krum Fleur-Delacour
`.trim();


export const sampleData: Sample[] = [
    {
        name: "Greek Gods Mythology (GEDCOM)",
        type: 'ged',
        content: greekMythologyGedcom
    },
    {
        name: "Harry Potter Character Network",
        type: 'txt',
        content: harryPotterContent
    },
    {
        name: "European & British Royal Family (GEDCOM)",
        type: 'ged',
        content: royalGedcom
    }
];
