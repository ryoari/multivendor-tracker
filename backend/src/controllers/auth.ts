import { Request, Response } from 'express';
import User from '../models/user';
import Vendor from '../models/vendor';
import DeliveryPartner from '../models/delivery';
import { generateToken } from '../utils/jwt';

// Register vendor
export const registerVendor = async (req: Request, res: Response) => {
  try {
    const { email, password, name, phone, businessName, businessAddress } = req.body;

    // Check if user exists
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Create user with vendor role
    const user = await User.create({
      email,
      password,
      name,
      phone,
      role: 'vendor'
    });

    // Create vendor profile
    await Vendor.create({
      _id: user._id,
      businessName,
      businessAddress
    });

    // Generate token
    const token = generateToken(user);

    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      token
    });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

// Login vendor
export const loginVendor = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    // Find user
    const user = await User.findOne({ email, role: 'vendor' });
    if (!user) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    // Check password
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    // Generate token
    const token = generateToken(user);

    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      token
    });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

// Register delivery partner
export const registerDelivery = async (req: Request, res: Response) => {
  try {
    const { email, password, name, phone } = req.body;

    // Check if user exists
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Create user with delivery role
    const user = await User.create({
      email,
      password,
      name,
      phone,
      role: 'delivery'
    });

    // Create delivery partner profile
    await DeliveryPartner.create({
      _id: user._id,
      currentLocation: { lat: 0, lng: 0 },
      isAvailable: true,
      currentOrder: null
    });

    // Generate token
    const token = generateToken(user);

    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      token
    });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

// Login delivery partner
export const loginDelivery = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    // Find user
    const user = await User.findOne({ email, role: 'delivery' });
    if (!user) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    // Check password
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    // Generate token
    const token = generateToken(user);

    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      token
    });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};