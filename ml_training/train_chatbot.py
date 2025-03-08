"""
Script to fine-tune DialoGPT model on elderly-appropriate conversations
"""
import os
import json
import torch
import logging
import argparse
import pandas as pd
from tqdm import tqdm
from transformers import (
    AutoModelForCausalLM,
    AutoTokenizer,
    TextDataset,
    DataCollatorForLanguageModeling,
    Trainer,
    TrainingArguments
)
from utils.data_processing import preprocess_conversations

# Set up logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s',
    handlers=[
        logging.StreamHandler(),
        logging.FileHandler("training_chatbot.log")
    ]
)
logger = logging.getLogger(__name__)

def prepare_dataset(data_path, output_dir, tokenizer):
    """
    Prepare the dataset for training. Converts conversation data to text files.
    """
    os.makedirs(output_dir, exist_ok=True)
    
    # Load and preprocess conversations
    if data_path.endswith('.json'):
        with open(data_path, 'r', encoding='utf-8') as f:
            conversations = json.load(f)
    elif data_path.endswith('.csv'):
        df = pd.read_csv(data_path)
        conversations = df.to_dict('records')
    else:
        raise ValueError(f"Unsupported file format: {data_path}")
    
    logger.info(f"Loaded {len(conversations)} conversations from {data_path}")
    
    # Preprocess conversations into training format
    processed_conversations = preprocess_conversations(conversations)
    
    # Save as text file for TextDataset
    train_file = os.path.join(output_dir, "train.txt")
    with open(train_file, 'w', encoding='utf-8') as f:
        for conversation in processed_conversations:
            f.write(conversation + "\n")
    
    logger.info(f"Saved processed conversations to {train_file}")
    
    # Create datasets
    train_dataset = TextDataset(
        tokenizer=tokenizer,
        file_path=train_file,
        block_size=128
    )
    
    return train_dataset

def train_model(args):
    """
    Fine-tune DialoGPT model on the provided dataset.
    """
    logger.info(f"Loading base model: {args.base_model}")
    
    # Load tokenizer and model
    tokenizer = AutoTokenizer.from_pretrained(args.base_model)
    tokenizer.pad_token = tokenizer.eos_token
    
    model = AutoModelForCausalLM.from_pretrained(args.base_model)
    
    # Prepare dataset
    logger.info("Preparing dataset...")
    train_dataset = prepare_dataset(
        args.data_path,
        args.output_dir,
        tokenizer
    )
    
    # Data collator
    data_collator = DataCollatorForLanguageModeling(
        tokenizer=tokenizer,
        mlm=False
    )
    
    # Training arguments
    training_args = TrainingArguments(
        output_dir=args.output_dir,
        overwrite_output_dir=True,
        num_train_epochs=args.epochs,
        per_device_train_batch_size=args.batch_size,
        save_steps=args.save_steps,
        save_total_limit=2,
        prediction_loss_only=True,
        logging_dir=os.path.join(args.output_dir, "logs"),
        logging_steps=args.logging_steps,
        learning_rate=args.learning_rate,
        warmup_steps=500,
        weight_decay=0.01,
    )
    
    # Initialize trainer
    trainer = Trainer(
        model=model,
        args=training_args,
        data_collator=data_collator,
        train_dataset=train_dataset,
    )
    
    # Train model
    logger.info("Starting training...")
    trainer.train()
    
    # Save model and tokenizer
    logger.info(f"Saving fine-tuned model to {args.output_dir}")
    model.save_pretrained(args.output_dir)
    tokenizer.save_pretrained(args.output_dir)
    
    logger.info("Training complete!")

if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Fine-tune DialoGPT for elderly companion chatbot")
    parser.add_argument("--base_model", type=str, default="microsoft/DialoGPT-medium", 
                        help="Base model to fine-tune")
    parser.add_argument("--data_path", type=str, required=True, 
                        help="Path to conversation data (JSON or CSV)")
    parser.add_argument("--output_dir", type=str, default="./output", 
                        help="Directory to save the fine-tuned model")
    parser.add_argument("--epochs", type=int, default=3, 
                        help="Number of training epochs")
    parser.add_argument("--batch_size", type=int, default=4, 
                        help="Training batch size")
    parser.add_argument("--save_steps", type=int, default=1000, 
                        help="Save checkpoint every X steps")
    parser.add_argument("--logging_steps", type=int, default=100, 
                        help="Log training stats every X steps")
    parser.add_argument("--learning_rate", type=float, default=5e-5, 
                        help="Learning rate")
    
    args = parser.parse_args()
    
    train_model(args)