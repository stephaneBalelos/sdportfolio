// === Wagon main javascript file ===

// Tell Webpack to load the style
import '../stylesheets/app.scss';

// Import the classes required to handle sections
import SectionsManager from './sections/_manager';
import * as Sections from './sections';

document.addEventListener('DOMContentLoaded', event => {

  // Load all the sections
  const sectionsManager = new SectionsManager();

  // Register sections here. DO NOT REMOVE OR UPDATE THIS LINE
  sectionsManager.registerSection('contact', Sections.Contact);
  sectionsManager.registerSection('work', Sections.Work);
  sectionsManager.registerSection('about', Sections.About);
  sectionsManager.registerSection('hero_header', Sections.HeroHeader);
  sectionsManager.registerSection('navigation', Sections.Navigation);
  sectionsManager.registerSection('flow_field', Sections.FlowField);

  sectionsManager.start();

});
