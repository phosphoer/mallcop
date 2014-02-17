var Phrases =
[
  "LAWFUL!",
  "DICTATED!",
  "REPRIMANDED!",
  "ARRESTED!",
  "ADMINISTRATED!",
  "ADMONISHED!",
  "APPEALED!",
  "NO ATTORNEY!",
  "MIRANDA RIGHTS!",
  "BAILED!",
  "CAPTIAL PUNISHMENT!",
  "CAVEAT!",
  "LAWYERED!",
  "CONDEMNED!",
  "SUBPOENA'ED!",
  "CONSTITUTIONAL!",
  "HELD IN CONTEMPT!",
  "CONVICTED!",
  "JUSTICE!",
  "APPEALED!",
  "OBJECTION!",
  "DISMISSED!",
  "DUE PROCESS!",
  "ENTRAPPED!",
  "ADJUDICATED!",
  "EQUITY!",
  "ETHICAL!",
  "EXECUTED!",
  "EXPUNGED!",
  "SERVED!",
  "FAIR MARKET VALUE!",
  "FELONY!",
  "FIDUCIARY!",
  "FORECLOSED!",
  "FORFEIT!",
  "GRIEVANCE!",
  "ALIMONY!",
  "HOSTILE WITNESS",
  "BIOLOGICAL FATHER!",
  "DECREED!",
  "IMMUNITY!",
  "IMPEACHMENT!",
  "EXHIBIT A!",
  "POLICE BRUTALITY!",
  "INCAPACITATED!",
  "STATUTE OF DOMINATION!",
  "INDICTMENT!",
  "INFRACTION!",
  "INTERROGATED!",
  "JUDGMENT!",
  "JURISDICTION!",
  "LAWSUIT!",
  "CLASS ACTION!",
  "LEGITIMATE!",
  "LEGALITY!",
  "LITIGATION!",
  "MALPRACTICE!",
  "MANSLAUGHTER!",
  "MARSHAL LAW!",
  "MISDEMEANOR!",
  "MITIGATION!",
  "MURDER!",
  "NEGOTIATED!",
  "PENALTY!",
  "NOISE CONTROL!",
  "REASONABLE!",
  "REMEDIED!",
  "SEARCH WARRANT!",
  "SELF DEFENSE!",
  "SENTENCED TO HELL!",
  "COLD CASE!",
  "SETTLEMENT!",
  "SLANDER!",
  "SOCIAL SECURITY!",
  "SPEEDY TRIAL!",
  "STATUTORY!",
  "PROBATION!",
  "SUMMONED!",
  "RAP SHEET!",
  "TAXABLE!",
  "TESTIMONY!",
  "VERDICT!",
  "MAXIMUM ENFORCER!"
];

function RandomPhrase()
{
  return Phrases[Math.floor(Math.random() * Phrases.length)];
}

function ShowPhrase(x, y)
{
  var phrase_text = RandomPhrase();
  var phrase = $("<div>").appendTo($("body"));

  $(phrase).text(RandomPhrase());
  $(phrase).addClass("Phrase");
  $(phrase).css("margin-left", x + Math.floor(Math.random() * 300));
  $(phrase).css("top", y + Math.floor(Math.random() * 300));

  $(phrase).animate(
  {
    "font-size": '+=12',
  }, 100,
  function()
  {
    $(phrase).animate(
    {
      opacity: 0.0,
      left: '+=50',
      top: '-=50',
    }, 2000,
    function()
    {
      $(phrase).remove();
    });
  });
}