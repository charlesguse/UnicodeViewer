 class Displayer {
     public checkForError(input: JQuery, error: boolean) {
         if (error) {
             input.addClass("has-error");
         } else {
             input.removeClass("has-error");
         }
     }
 }