package com.PAF.SkillShare.service;

import com.PAF.SkillShare.model.Tutorial;
import com.PAF.SkillShare.repository.TutorialRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class TutorialService {

    private final TutorialRepository tutorialRepository;

    @Autowired
    public TutorialService(TutorialRepository tutorialRepository) {
        this.tutorialRepository = tutorialRepository;
    }

    public Tutorial createTutorial(Tutorial tutorial) {
        return tutorialRepository.save(tutorial);
    }

    public List<Tutorial> getAllTutorials() {
        return tutorialRepository.findAll();
    }

    public Tutorial getTutorialById(String id) {
        return tutorialRepository.findById(id).orElse(null);
    }

    public Tutorial updateTutorial(String id, Tutorial updatedTutorial) {
        return tutorialRepository.findById(id).map(existing -> {
            existing.setTitle(updatedTutorial.getTitle());
            existing.setDescription(updatedTutorial.getDescription());
            existing.setCategory(updatedTutorial.getCategory());
            existing.setEstimatedCompletionTime(updatedTutorial.getEstimatedCompletionTime());
            existing.setSteps(updatedTutorial.getSteps());
            existing.setResources(updatedTutorial.getResources());
            existing.setCreatedBy(updatedTutorial.getCreatedBy());
            existing.setCreatedAt(updatedTutorial.getCreatedAt());
            return tutorialRepository.save(existing);
        }).orElse(null);
    }

    public boolean deleteTutorial(String id) {
        if (tutorialRepository.existsById(id)) {
            tutorialRepository.deleteById(id);
            return true;
        } else {
            return false;
        }
    }
}
