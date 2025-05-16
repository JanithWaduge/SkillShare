package com.PAF.SkillShare.controller;

import com.PAF.SkillShare.model.Tutorial;
import com.PAF.SkillShare.service.TutorialService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.bind.annotation.PathVariable;


import java.util.List;

@RestController
@RequestMapping("/api/tutorials")
public class TutorialController {

    @Autowired
    private TutorialService tutorialService;

    @PostMapping
    public Tutorial createTutorial(@RequestBody Tutorial tutorial) {
        return tutorialService.createTutorial(tutorial);
    }

    @GetMapping
    public List<Tutorial> getAllTutorials() {
        return tutorialService.getAllTutorials();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Tutorial> getTutorialById(@PathVariable String id) {
        Tutorial tutorial = tutorialService.getTutorialById(id);
        if (tutorial != null) {
            return ResponseEntity.ok(tutorial);
        } else {
            return ResponseEntity.notFound().build();
        }
    }
}
